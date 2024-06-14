import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoPricetagOutline } from "react-icons/io5";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { axiosInstance } from "@/lib/axios.config";
import EventReview from "./EventReview";

interface TicketCardProps {
  title?: string;
  price?: number;
  discountPrice?: number;
  id?: string;
  startPromo?: string;
  endPromo?: string;
  type?: string;
  endTime?: string;
}
interface User {
  username: string;
}
interface Review {
  rating: number;
  description: string;
  createdAt: string;
  user: User; // Assuming the user_id is part of the review
}
const TicketCard: React.FC<TicketCardProps> = ({
  title,
  price,
  discountPrice,
  id,
  startPromo,
  endPromo,
  type,
  endTime,
}) => {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!id) return;

        const orderResponse = await axiosInstance().get(
          `/event/getReviewByEventId/${id}`
        );
        const { data } = orderResponse.data; // Adjust based on your API response structure
        if (Array.isArray(data)) {
          setReviews(data); // Ensure data is an array before setting it
        } else {
          console.error("Fetched data is not an array: ", data);
        }
      } catch (error) {
        console.error("error fetching", error);
      }
    };

    fetchEventData();
  }, [id]);

  const handleBuyTickets = () => {
    if (endTime && new Date() > new Date(endTime)) {
      Swal.fire({
        icon: "error",
        title: "Oops... event has started",
        text: "Ticket sale has already ended!",
      });
    } else {
      if (id) {
        router.push(`/checkout/${id}`);
      }
    }
  };
  const censorUsername = (username: string) => {
    return username.slice(0, -3) + "***";
  };

  return (
    <div className="border flex flex-col rounded-lg shadow-md overflow-hidden p-4 w-[400px]">
      <div className="font-bold text-xl mb-2">{title || "Event Title"}</div>
      <div className="flex items-center mb-2">
        <IoPricetagOutline className="mr-1" />
        {type === "FREE" ? (
          <span>FREE</span>
        ) : discountPrice &&
          endPromo &&
          startPromo &&
          new Date() <= new Date(endPromo) &&
          new Date() > new Date(startPromo) ? (
          <>
            <span className="line-through mr-2">
              {price !== undefined ? formatPrice(price) : "N/A"}
            </span>
            <span className="text-red-500">{formatPrice(discountPrice)}</span>
          </>
        ) : (
          <span>{price !== undefined ? formatPrice(price) : "N/A"}</span>
        )}
      </div>
      {discountPrice && endPromo && new Date() <= new Date(endPromo) && (
        <div className="text-sm text-gray-500 mb-2">
          Discount only until {dayjs(endPromo).format("DD MMMM YYYY")}
        </div>
      )}
      <div className="flex flex-row justify-between">
        <button className="btn btn-dark" onClick={handleBuyTickets}>
          Buy Ticket
        </button>
      </div>
      {reviews && reviews.length > 0 && (
        <div className="mt-4">
          {reviews
            .filter((item) => item.rating > 0)
            .map((review, index) => (
              <EventReview
                key={index}
                rating={review.rating}
                username={censorUsername(review.user.username)}
                reviewText={review.description}
                reviewDate={dayjs(review.createdAt).format("DD MMMM YYYY")}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default TicketCard;
