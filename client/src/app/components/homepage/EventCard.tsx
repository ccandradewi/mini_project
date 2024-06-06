"use client";
import { axiosInstance } from "@/lib/axios.config";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  banner: string;
  title: string;
  description: string;
  start_time: string;
  location: string;
  ticket_price: number;
  promotor: string;
  discount_price?: number;
  promo?: string;
}

const EventCard: React.FC = () => {
  const router = useRouter();

  const [events, setEvents] = useState<Event[]>([]);

  const fetchEventData = async () => {
    try {
      const response = await axiosInstance().get("/event");
      const { data } = response.data;

      console.log(data);

      const formattedData = data.map((event: any) => ({
        ...event,
        banner: `data:image/jpeg;base64,${Buffer.from(
          event.banner,
          "binary"
        ).toString("base64")}`,
      }));
      setEvents(formattedData);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-ID");
  };

  const redirectToEvent = (id: string) => {
    router.push(`/event/${id}`);
  };

  return (
    <div className="">
      <div className="flex flex-row flex-wrap gap-6 justify-center">
        {events.length > 0 &&
          events.map((event) => (
            <div
              key={event.id}
              className="border w-80 flex flex-col rounded-lg shadow-md overflow-hidden truncate cursor-pointer"
              onClick={() => redirectToEvent(event.id)}
            >
              <div className="h-32 relative">
                <img
                  src={event.banner}
                  alt=""
                  className="object-cover w-full h-full"
                  // onLoad={handleImageLoad} // Cleanup temporary URL on load
                />
              </div>
              <div className="p-3 gap-2 flex flex-col">
                <div className="text-md font-bold">{event.title}</div>
                <div className="text-md">
                  {dayjs(event.start_time).format("DD MMMM YYYY")}
                </div>{" "}
                {/* <div className="font-bold">
                  {event.promo && event.discount_price !== undefined
                    ? `IDR ${formatPrice(event.discount_price)}`
                    : event.ticket_price === 0
                    ? "FREE"
                    : `IDR ${formatPrice(event.ticket_price)}`}
                </div> */}
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
                <div className="border my-2" />
                <div className="flex flex-row  gap-2">
                  <div>{event.promotor}</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EventCard;
