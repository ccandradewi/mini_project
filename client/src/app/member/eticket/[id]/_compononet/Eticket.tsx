"use client";
import { axiosInstance } from "@/lib/axios.config";
import { imageSrc } from "@/utils/image.render";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  IoCalendarOutline,
  IoLocationOutline,
  IoTicketOutline,
} from "react-icons/io5";
interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

interface Event {
  id: string;
  title: string;
  venue: string;
  start_time: string;
  banner: string | null;
  location: string;
}

interface Order {
  id: string;
  total_ticket: number;
  total_price: number;
  payment_method: string;
  inv_id: string;
  user: User;
  event: Event;
}

const Eticket = () => {
  const [orders, setOrder] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const { id } = params;
  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const response = await axiosInstance().get(`/orders/ticket/${id}`);
        const orders = response.data.data;
        console.log("ini order", orders);

        setOrder(orders);
      } catch (error) {
        console.log("error");
      } finally {
        setLoading(false);
      }
    };
    fetchTicketData();
  }, [id]);
  // console.log("tesstt");
  // console.log("ini", orders);

  return (
    <>
      <div className="flex flex-row justify-between w-full gap-4 ">
        <div className="w-1/2 ">
          <div className="flex flex-col gap-4 justify center items-center  border rounded-xl h-96">
            <div className="py-4">
              <img
                className="h-36"
                src="https://www.loket.com/assets-v2/img/opt-in-registration-promo.png"
                alt=""
              />
            </div>
            <span className="text-lg font-bold text-center">
              Thank You for Your Order!
            </span>
            <div className="text-center text-black px-8">
              Thank you for purchasing a ticket! We are thrilled to have you
              join us for what promises to be an unforgettable experience. Your
              order has been successfully processed, and your Tickets are
              confirmed.
            </div>
          </div>
        </div>

        {orders &&
          orders.map((order, index) => (
            <div key={index} className="flex flex-col gap-4 ">
              <div className="flex-col flex border rounded-xl shadow-md h-[280px] justify-center px-8">
                <div className="flex flex-row justify-between">
                  <div>
                    Invoice number:
                    <span className="font-semibold"> {order.inv_id}</span>
                  </div>
                </div>
                <div className="border-b" />
                <div className="flex flex-row gap-4 pt-3">
                  <div className="w-[420px] h-48 relative">
                    <img
                      src={`${imageSrc}${order?.event.id}`}
                      alt="Event Banner"
                      className="object-cover w-full h-full rounded-xl"
                    />
                  </div>
                  <div className="border-r" />
                  <div className="flex-col flex gap-2 justify-center">
                    <div className="font-semibold">Ticket</div>

                    <div className="flex flex-row gap-2">
                      <div>
                        <IoTicketOutline />
                      </div>
                      <div className="">
                        <div className="font-semibold">
                          {order?.event?.title} (Regular)
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold mb-2">Event details</div>
                      <div className="flex flex-row items-center gap-2">
                        <IoCalendarOutline />{" "}
                        {dayjs(order?.event?.start_time).format("DD MMMM YYYY")}
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <IoLocationOutline /> {order?.event?.venue},{" "}
                        {order?.event?.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* user data */}
              <div className="flex-col flex border rounded-xl justify-center px-8 py-4">
                <div className="flex flex-row gap-2">
                  Name:
                  <p className=" font-semibold">
                    {order.user.first_name} {order.user.last_name}
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  Email:
                  <p className=" font-semibold">{order.user.email}</p>
                </div>
                <div className="flex flex-row gap-2">
                  Phone Number:
                  <p className=" font-semibold">{order.user.phone_number}</p>
                </div>
              </div>
              {/* SECTION ORDER SUMMARY */}
              <div className=" flex flex-col gap-2 p-4 border-1 rounded-xl justify-center">
                <div className="font-semibold text-xl">Detail payment</div>
                <div className="flex flex-row justify-between">
                  <div>Invoice:</div>
                  <div>{order.inv_id}</div>
                </div>
                <div className="flex flex-row justify-between">
                  <div>Total Ticket</div>
                  <div>{order.total_ticket}</div>
                </div>
                <div className="flex flex-row justify-between">
                  <div>Subtotal</div>
                  <div>Rp {order.total_price.toLocaleString()}</div>
                </div>
                <div className="border-b" />
                <div className="flex flex-row justify-between font-semibold mb-2">
                  <div>Total</div>
                  <div>Rp {order.total_price.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Eticket;
