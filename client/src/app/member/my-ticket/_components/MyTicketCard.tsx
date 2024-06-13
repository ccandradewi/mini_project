"use client";
import React, { useState, useEffect } from "react";
import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios.config";
import dayjs from "dayjs";
import { imageSrc } from "@/utils/image.render";
import ReviewModal from "./ReviewModal"; // Import the outsourced modal component
import { useAppSelector } from "@/app/hooks";
import { TUser } from "@/models/user.model";
interface Event {
  id: string;
  banner: string;
  title: string;
  description: string;
  city: string;
  category: string;
  start_time: string;
  end_time: string;
  ticket_price: number;
  availability: boolean;
  promo: boolean;
  start_promo: string;
  end_promo: string;
  createdAt: string;
  updatedAt: string;
  venue: string;
  discount_price: number;
}
interface User {
  id: string;
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address?: string;
  dob?: string; // DateTime in Prisma translates to string in TypeScript for JSON compatibility
  avatar?: string;
  referral_code?: string;
  reference_code?: string;
  isVerified?: boolean;
  bankAccount?: string;
  bank?: string;
  createdAt: string; // DateTime in Prisma translates to string in TypeScript for JSON compatibility
  updatedAt: string; // DateTime in Prisma translates to string in TypeScript for JSON compatibility
  events?: Event[];
  orders?: Order[];
  reviews?: Review[];
}
interface Review {
  id: string;
  user: User;
  user_id: string;
  order_id: string;
  order: Order;
  description: string;
  rating: number;
  event_id: string;
  createdAt: string;
  updatedAt: string;
}
interface Order {
  id: string;
  buyer_id: string;
  event: Event;
  event_id: string;
  total_ticket: number;
  total_price: number;
  date: string;
  review: Review;
  payment_date: string;
  payment_method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  buyer?: User;
}
interface OrderWithReview {
  id: string;
  buyer_id: string;
  event_id: string;
  event: Event;
  total_ticket: number;
  total_price: number;
  date: string;
  payment_date: string;
  payment_method: string;
  status: string;
  review?: Review; // Assuming only one review per order
  createdAt: string;
  updatedAt: string;
  buyer?: User;
  rating: number;
  reviewDescription: string;
}
function MyTicketCard() {
  const router = useRouter();
  const loggedinUser = useAppSelector((state) => state.auth) as TUser;
  const [orders, setOrders] = useState<OrderWithReview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithReview | null>(
    null
  );
  const [rating, setRating] = useState(0);
  const [isButtonReviewClicked, setIsButtonReviewClicked] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [isNowFetchingReview, setIsNowFetchingReview] = useState(true);
  // Track events for which the review button is already shown
  const [reviewButtonShown, setReviewButtonShown] = useState<Set<string>>(
    new Set()
  );

  const fetchOrderData = async () => {
    try {
      const response = await axiosInstance().get("/orders/buyer/myTicket");
      const orders: Order[] = response.data.data;
      // Create a set of event IDs that have been reviewed by the user
      const reviewedEventsSet = new Set<string>();
      let newOrderWithReview: OrderWithReview[] = [];
      if (orders.length > 0) {
        const reviewData = await fetchReviewData(orders[0].buyer_id);
        newOrderWithReview = [];
        console.log("reviewData", reviewData);

        orders.forEach((order, indexOrder) => {
          let obj: OrderWithReview = {
            ...order,
            rating: 0,
            reviewDescription: "",
          };
          reviewData.forEach((review: Review) => {
            if (review.rating > 0 && order.event_id == review.event_id) {
              console.log("masuk");
              obj = {
                ...order,
                rating: review.rating,
                reviewDescription: review.description,
              };
            }
          });
          newOrderWithReview.push(obj);
        });
      }

      console.log(newOrderWithReview);

      setOrders(newOrderWithReview);
      // Reset the review button tracking state
      setReviewButtonShown(reviewedEventsSet);
    } catch (error) {
      console.error("Error fetching event data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviewData = async (userId: string) => {
    try {
      const reviewResponse = await axiosInstance().get(
        `/event/getReviewByUserId/${userId}`
      );
      return reviewResponse.data.data;
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-ID");
  };

  useEffect(() => {
    fetchOrderData();
  }, [isNowFetchingReview]);

  const handleOpenModal = (order: OrderWithReview) => {
    setIsButtonReviewClicked(true);
    // Check if the order already has a review with a rating greater than 0
    if (order.review && order.review.rating > 0) {
      // Notify the user that the review has already been given
      return;
    }
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setIsNowFetchingReview(!isNowFetchingReview);
    setIsButtonReviewClicked(false);
    setShowModal(false);
    setSelectedOrder(null);
    setRating(0);
    setReviewText("");
  };

  const handleSubmitReview = async () => {
    setIsButtonReviewClicked(true);
    if (!selectedOrder) return;

    const orderId = selectedOrder.id;

    try {
      const request = await axiosInstance().post(
        "/event/addReview",
        {
          order_id: orderId,
          description: reviewText,
          rating: rating,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Review submitted successfully:", request.data);

      console.log(
        "Submitting review with rating:",
        rating,
        "and text:",
        reviewText
      );
      // Close the modal after submission
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  return (
    <div className="py-10 px-6">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order, index) => {
            const showButton = dayjs(order.event.end_time).isBefore(dayjs());

            return (
              <div
                key={index}
                className={`flex flex-col flex-wrap gap-10 justify-center ${
                  order.status === "pending" || order.status === "confirmed"
                    ? "cursor-pointer"
                    : ""
                }`}
                onClick={() => {
                  if (order.status === "pending") {
                    router.push(`/invoice/${order.id}`);
                  } else if (order.status === "confirmed") {
                    router.push(`/member/eticket/${order.id}`);
                  }
                }}
                // onClick={() => router.push(`/invoice/${order.id}`)}
              >
                <div className="border w-full flex flex-row justify-between rounded-lg shadow-md overflow-hidden truncate cursor-pointer">
                  <div className="p-4 gap-2 flex flex-col">
                    {order.status === "pending" && (
                      <div>
                        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-xl text-base font-bold bg-yellow-400 text-black">
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    )}
                    {order.status === "confirmed" && (
                      <div>
                        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-xl text-base font-bold bg-green-500 text-white">
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    )}
                    {order.status === "cancelled" && (
                      <div>
                        <span className="inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded-xl text-base font-bold bg-red-700 text-black">
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="text-md font-bold text-xl">
                      {order.event.title}
                    </div>
                    <div className="flex flex-row gap-10">
                      <div className="text-sm flex flex-row items-center gap-2">
                        <IoCalendarOutline />{" "}
                        {dayjs(order.event.start_time).format("DD MMMM YYYY")}
                      </div>
                      <div className="text-sm flex flex-row items-center gap-2">
                        <IoLocationOutline /> {order.event.venue}
                      </div>
                    </div>
                    <div className="font-bold">
                      Total Ticket : {order.total_ticket}
                    </div>
                    <div className="font-bold">
                      IDR {formatPrice(order.total_price)}
                    </div>
                    {order.rating > 0 && (
                      <div className="text-sm">
                        Your given rating: {order.rating}
                      </div>
                    )}
                    {showButton && (
                      <button
                        className={`btn mt-2 py-2 px-4 bg-blue-600 text-white rounded-md ${
                          isButtonReviewClicked || order.rating > 0
                            ? "btn-secondary"
                            : "btn-primary"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(order);
                        }}
                        disabled={isButtonReviewClicked || order.rating > 0}
                      >
                        Review Event
                      </button>
                    )}
                  </div>
                  <div className="w-[400px] h-60 relative p-3">
                    <img
                      src={`${imageSrc}${order.event.id}`}
                      alt="Event Banner"
                      className="object-cover w-full h-full rounded-xl"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {showModal && selectedOrder && (
        <ReviewModal
          order={selectedOrder}
          rating={rating}
          reviewText={reviewText}
          onRatingChange={handleRatingChange}
          onReviewTextChange={(text) => setReviewText(text)}
          onClose={handleCloseModal}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}

export default MyTicketCard;
