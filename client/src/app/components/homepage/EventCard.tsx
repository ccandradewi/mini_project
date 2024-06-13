"use client";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { imageSrc } from "@/utils/image.render";
import { axiosInstance } from "@/lib/axios.config";

export interface Event {
  id: string;
  user_id: string;
  banner: string;
  title: string;
  description: string;
  city: string;
  location: string;
  type: string;
  category: string;
  promotor: string;
  start_time: string;
  end_time: string;
  ticket_price: number;
  discount_price?: number;
  availability: string;
  promo: string;
  start_promo: string;
  end_promo: string;
  createdAt: string;
  updatedAt: string;
  venue: string;
}

interface EventCardProps {
  events: Event[];
  selectedCity: string;
  searchResults: Event[];
  selectedCityText: string;
}

const EventCard: React.FC<EventCardProps> = ({
  events,
  selectedCity,
  searchResults,
  selectedCityText,
}) => {
  const router = useRouter();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const fetchFilteredEventData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axiosInstance().get(
          `/event/f?city=${selectedCity}`
        );
        console.log("Filtered Events Data:", response.data);
        const { data } = response.data;
        setFilteredEvents(data);
      } catch (error) {
        console.error("Error fetching filtered event data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (selectedCity) {
      fetchFilteredEventData();
    } else {
      setFilteredEvents(events);
    }
  }, [selectedCity, events]);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const redirectToEvent = (id: string) => {
    router.push(`/event/${id}`);
  };
  const eventsToDisplay =
    searchResults.length > 0 ? searchResults : filteredEvents;

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {loading && <div>Loading events...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && eventsToDisplay.length > 0
        ? eventsToDisplay.map((event) => (
            <div
              key={event.id}
              className="border w-80 flex flex-col rounded-lg shadow-md overflow-hidden truncate cursor-pointer"
              onClick={() => redirectToEvent(event.id)}
            >
              <div className="h-32 relative">
                <img
                  src={`${imageSrc}${event.id}`}
                  alt=""
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-3 gap-2 flex flex-col">
                <div className="text-md font-bold">{event.title}</div>
                <div className="text-md">
                  {dayjs(event.start_time).format("DD MMMM YYYY")}
                </div>
                <div>{event.venue}</div>
                <div className="font-bold">
                  {event.discount_price &&
                  event.end_promo &&
                  new Date() <= new Date(event.end_promo) ? (
                    <div>
                      <span className="line-through mr-2">
                        IDR {event.ticket_price.toLocaleString("en-ID")}
                      </span>
                      <span>
                        IDR {event?.discount_price.toLocaleString("en-ID")}
                      </span>
                    </div>
                  ) : event.ticket_price === 0 ? (
                    "FREE"
                  ) : (
                    `IDR ${event.ticket_price.toLocaleString("en-ID")}`
                  )}
                </div>
                <div className="border my-2" />
                <div className="flex flex-row gap-2">
                  <div>{event.promotor}</div>
                </div>
              </div>
            </div>
          ))
        : !loading && (
            <div className="text-center text-gray-500">
              No events found in {selectedCity}
            </div>
          )}
    </div>
  );
};

export default EventCard;
