"use client";
import React, { useState, useEffect } from "react";
import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
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

interface Order {
  id: string;
  buyer_id: string;
  event: Event;
  total_ticket: number;
  total_price: number;
  date: string;
  payment_date: string;
  payment_method: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

function MyTicketCard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchOrderData = async () => {
    try {
      const response = await axiosInstance().get("/orders/buyer/myTicket");
      console.log("Response data:", response.data);
      const orders: Order[] = response.data.data;
      setOrders(orders);
    } catch (error) {
      console.error("Error fetching event data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("en-ID");
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  return (
    <div className="py-10 px-6">
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order, index) => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTicketCard;
