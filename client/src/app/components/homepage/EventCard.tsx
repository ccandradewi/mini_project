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
}

const EventCard: React.FC<EventCardProps> = ({
  events,
  selectedCity,
  searchResults,
}) => {
  const router = useRouter();
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  // const [events, setEvents] = useState<Event[]>([]);

  // const fetchAllEventData = async () => {
  //   try {
  //     const response = await axiosInstance().get("/event");
  //     console.log("All Events Data:", response.data); // Log all events data
  //     const { data } = response.data;
  //     setEvents(data);
  //   } catch (error) {
  //     console.error("Error fetching event data:", error);
  //   }
  // };

  const fetchFilteredEventData = async () => {
    try {
      const response = await axiosInstance().get(
        `/event/f?city=${selectedCity}`
      );
      console.log("Filtered Events Data:", response.data); // Log filtered events data
      const { data } = response.data;
      setFilteredEvents(data);
    } catch (error) {
      console.error("Error fetching filtered event data:", error);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchFilteredEventData();
    } else {
      setFilteredEvents(events);
      // fetchAllEventData(); // Set empty array for "All Cities"
      // setEvents([]);
    }
  }, [selectedCity, events]);

  const redirectToEvent = (id: string) => {
    router.push(`/event/${id}`);
  };
  const eventsToDisplay =
    searchResults.length > 0 ? searchResults : filteredEvents;

  // // Log events for debugging on state change (improved for clear logging)
  // useEffect(() => {
  //   console.group("EventCard: events updated");
  //   console.log("Events:", events);
  //   console.log("Selected City:", selectedCity);
  //   console.groupEnd();
  // }, [events, selectedCity]);

  // Render event cards based on fetched data
  return (
    <div className="flex flex-row flex-wrap gap-4">
      {eventsToDisplay.length > 0 &&
        eventsToDisplay.map((event) => (
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
                {event.promo && event.discount_price !== undefined ? (
                  <div>
                    <span className="line-through mr-2">
                      IDR {event.ticket_price.toLocaleString("en-ID")}
                    </span>
                    <span>
                      IDR {event.discount_price.toLocaleString("en-ID")}
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
        ))}
      {events.length === 0 && (
        <div className="text-center text-gray-500">
          No events found in {selectedCity}
        </div>
      )}
    </div>
  );
};

export default EventCard;
