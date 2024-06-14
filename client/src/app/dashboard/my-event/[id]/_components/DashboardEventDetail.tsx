"use client";
import { axiosInstance } from "@/lib/axios.config";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { imageSrc } from "@/utils/image.render";
import EventReview from "@/app/event/[id]/_components/EventReview";
interface Event {
  id: string;
  banner: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  ticket_price: number;
  promotor: string;
  discount_price?: number;
  promo?: string;
  venue: string;
  start_promo: string;
  end_promo: string;
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
function DashboardEventDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const censorUsername = (name: string) => {
    const length = name.length;
    const visiblePart = name.slice(0, Math.max(0, length - 3));
    return `${visiblePart}***`;
  };
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!id) return;

        const response = await axiosInstance().get(
          `/event/dashboard/detail/${id}`
        );

        const { data } = response.data;
        setEvent(data);
        console.log(data);
      } catch (error) {
        console.error("error fetching", error);
      }
    };

    fetchEventData();
  }, [id]);
  useEffect(() => {
    const fetchReviewData = async () => {
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

    fetchReviewData();
  }, [id]);
  const handleDeleteEvent = async () => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await axiosInstance().delete(`/event/${id}`);
        router.push("/dashboard/my-event");
      } catch (error) {
        console.error("Error deleting event", error);
      }
    }
  };

  return (
    <>
      <div className="">
        <div className="lg:px-32 py-6">
          {/* BREADCRUMBS */}
          <div className="text-sm breadcrumbs pt-6">
            <ul>
              <li>
                <a
                  href="/dashboard/my-event"
                  className="text-black  no-underline"
                >
                  My Events
                </a>
              </li>
              <li className="font-semibold text-[#B31312]">{event?.title}</li>
            </ul>
          </div>

          {/* BANNER */}
          <div className="">
            <div className="w-full h-80 px-4 relative">
              <img
                src={`${imageSrc}${event?.id}`}
                alt="Event Banner"
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <div className="p-4 gap-6 flex flex-col">
              <div className="font-bold text-4xl">{event?.title}</div>
              <div className="flex flex-col gap-2">
                <div className="text-lg flex flex-row items-center gap-2 font-semibold">
                  <IoCalendarOutline />{" "}
                  {event?.start_time && event?.end_time
                    ? dayjs(event.start_time).isSame(
                        dayjs(event.end_time),
                        "day"
                      )
                      ? dayjs(event.start_time).format("DD MMMM YYYY")
                      : `${dayjs(event.start_time).format(
                          "DD MMMM YYYY"
                        )} - ${dayjs(event.end_time).format("DD MMMM YYYY")}`
                    : dayjs(event?.start_time).format("DD MMMM YYYY")}
                </div>

                <div className="text-lg font-semibold flex flex-row items-center gap-2">
                  <IoLocationOutline /> {event?.venue}, {event?.location}
                </div>
              </div>

              <div className="text-justify">{event?.description}</div>
            </div>

            <div className="flex flex-col gap-4 p-4 items-center">
              <button
                className="bg-[#EA906C] w-40 px-4 py-2 rounded-full shadow-md font-semibold flex flex-row items-center gap-2 hover:bg-[#EEE2DE] duration-100 text-sm"
                onClick={() => router.push(`/dashboard/my-event/edit/${id}`)}
              >
                <FiEdit /> Edit event
              </button>

              <button
                className="bg-[#B31312] w-40 px-4 py-2 rounded-full shadow-md font-semibold flex flex-row items-center gap-2 hover:bg-[#EEE2DE] duration-100 text-white text-sm"
                onClick={handleDeleteEvent}
              >
                <MdDeleteOutline /> Delete event
              </button>
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
                        reviewDate={dayjs(review.createdAt).format(
                          "DD MMMM YYYY"
                        )}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardEventDetail;
