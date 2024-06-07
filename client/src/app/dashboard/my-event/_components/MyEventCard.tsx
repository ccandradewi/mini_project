"use client";
import React from "react";
import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios.config";
import dayjs from "dayjs";
import { imageSrc } from "@/utils/image.render";

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

function MyEventCard() {
  const router = useRouter();

  const redirectToEvent = (id: string) => {
    router.push(`/dashboard/my-event/${id}`);
  };

  const [events, setEvents] = useState<Event[]>([]);

  const fetchEventData = async () => {
    try {
      const response = await axiosInstance().get("/event/myEvent");
      const { data } = response.data;

      setEvents(data);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-ID");
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  return (
    <>
      <div className="py-10 px-6">
        <div className="flex flex-col gap-8">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex flex-col flex-wrap gap-10 justify-center"
              onClick={() => router.push(`/dashboard/my-event/${event.id}`)}
            >
              <div className="border w-full flex flex-row justify-between rounded-lg shadow-md overflow-hidden truncate cursor-pointer">
                <div className="p-4 gap-2 flex flex-col">
                  <div className="text-md font-bold text-xl">{event.title}</div>
                  <div className="flex flex-row gap-10">
                    <div className="text-sm flex flex-row items-center gap-2">
                      <IoCalendarOutline />{" "}
                      {dayjs(event.start_time).format("DD MMMM YYYY")}
                    </div>
                    <div className="text-sm flex flex-row items-center gap-2">
                      <IoLocationOutline /> {event.venue}
                    </div>
                  </div>

                  <div className="font-bold">
                    {event.promo && event.discount_price !== undefined ? (
                      <div>
                        <span className="line-through mr-2">
                          IDR {formatPrice(event.ticket_price)}
                        </span>
                        <span>IDR {formatPrice(event.discount_price)}</span>
                      </div>
                    ) : event.ticket_price === 0 ? (
                      "FREE"
                    ) : (
                      `IDR ${formatPrice(event.ticket_price)}`
                    )}
                  </div>

                  {event.promo && (
                    <div className="text-sm">
                      Promo period:
                      <span className="font-bold">
                        {" "}
                        {dayjs(event.start_promo).format("DD MMMM YYYY")} -{" "}
                      </span>
                      <span className="font-bold">
                        {dayjs(event.end_promo).format("DD MMMM YYYY")}
                      </span>
                    </div>
                  )}
                  <div className="text-sm pt-8">
                    Posted on{" "}
                    <b>{dayjs(event.createdAt).format("DD MMMM YYYY")}</b>
                  </div>

                  <div className="text-sm">
                    Last edited on{" "}
                    <b>{dayjs(event.updatedAt).format("DD MMMM YYYY")}</b>
                  </div>
                </div>

                <div className="w-[400px] h-60 relative p-3">
                  <img
                    src={`${imageSrc}${event.id}`}
                    alt="Event Banner"
                    className="object-cover w-full h-full rounded-xl"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default MyEventCard;
