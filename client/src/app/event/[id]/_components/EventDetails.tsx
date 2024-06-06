"use client";
import { axiosInstance } from "@/lib/axios.config";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import TicketCard from "./TicketCard";

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

function EventDetails() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!id) return;

        const response = await axiosInstance().get(`/event/detail/${id}`);

        const { data } = response.data;
        const formattedData = {
          ...data,
          banner: `data:image/jpeg;base64,${Buffer.from(
            data.banner,
            "binary"
          ).toString("base64")}`,
        };
        setEvent(formattedData);
        // setEvent(data);
        console.log(data);

        // const eventData: Event = response.data;
        // setEvent(eventData);
        // console.log(eventData);
      } catch (error) {
        console.error("error fetching", error);
      }
    };

    fetchEventData();
  }, []);

  return (
    <>
      <div className=" w-screen">
        <div className="lg:px-32 py-6">
          {/* BREADCRUMBS */}
          <div className="text-sm breadcrumbs pt-6">
            <ul>
              <li>
                <a href="/" className="text-black  no-underline">
                  Home
                </a>
              </li>
              <li className="font-semibold text-[#B31312]">{event?.title}</li>
            </ul>
          </div>

          {/* BANNER */}
          <div className="flex flex-row">
            <div className="w-full h-80 px-4 relative">
              <img
                src={event?.banner}
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

            <div className="flex-shrink-0 p-4">
              {event?.promo ? (
                <TicketCard
                  title={event?.title}
                  price={event?.ticket_price}
                  discountPrice={event?.discount_price}
                />
              ) : (
                <TicketCard title={event?.title} price={event?.ticket_price} />
              )}
            </div>

            {/* {event?.promo && (
              <div className="text-sm">
                Promo period:
                <span className="font-bold">
                  {" "}
                  {dayjs(event?.start_promo).format("DD MMMM YYYY")} -{" "}
                </span>
                <span className="font-bold">
                  {dayjs(event?.end_promo).format("DD MMMM YYYY")}
                </span>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}

export default EventDetails;
