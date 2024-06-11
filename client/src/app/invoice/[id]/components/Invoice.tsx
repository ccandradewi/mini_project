"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios.config";
import dayjs from "dayjs";
import { imageSrc } from "@/utils/image.render";
import {
  IoTicketOutline,
  IoCalendarOutline,
  IoLocationOutline,
} from "react-icons/io5";

interface User {}

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
  type: string;
}

interface Order {
  id: string;
  buyer_id: string;
  event_id: string;
  total_ticket: number;
  total_price: number;
  payment_method: string;
  payment_proof: string;
  date: string;
  payment_date: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  inv_id: string;
  event: Event;
}

const paymentMethodMap: { [key: string]: string } = {
  bank: "BCA Transfer",
  virtualaccount: "Virtual Account",
  shopeepay: "ShopeePay",
  gopay: "GoPay",
};

function Invoice() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [order, setOrder] = useState<Order | null>(null);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [countdown, setCountdown] = useState<string | null>("");

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        if (!id) return;

        const response = await axiosInstance().get(`/orders/${id}`);
        const { data } = response.data;
        setOrder(data);
        console.log("Order data:", data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, [id]);

  // COUNTDOWN SECTION
  useEffect(() => {
    if (order) {
      const createdAt = dayjs(order.createdAt);
      const expirationTime = createdAt.add(1, "minute");
      const interval = setInterval(() => {
        const now = dayjs();
        const remainingTime = expirationTime.diff(now);
        if (remainingTime <= 0) {
          clearInterval(interval);
          setCountdown("Expired");
          setMessage(
            "Your order has been cancelled. You have exceeded the payment deadline."
          );
        } else {
          const minutes = Math.floor(remainingTime / 60000);
          const seconds = Math.floor((remainingTime % 60000) / 1000);
          setMinutes(minutes);
          setSeconds(seconds);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [order]);

  const paymentMethod =
    paymentMethodMap[order?.payment_method as keyof typeof paymentMethodMap] ||
    order?.payment_method;

  const calculateExpiration = () => {
    if (!order) return "";
    const creationDate = dayjs(order.createdAt);
    const expirationDate = creationDate.add(10, "minute");
    return expirationDate.format("h:mm A [on] DD MMMM YYYY");
  };

  const expirationTime = order ? calculateExpiration() : "";

  return (
    <>
      <div className="w-screen">
        <div className="px-10">
          <div className="flex flex-row gap-4 lg:p-10">
            {/* SECTION PEMBAYARAN */}

            <div className="flex flex-col w-1/3 justify-center border p-4 rounded-xl gap-2 shadow-md">
              {minutes > 0 || seconds > 0 ? (
                <>
                  <div>
                    Complete your payment before{" "}
                    <span className="font-semibold">{expirationTime}</span>
                  </div>
                  <div className="flex flex-row justify-center pt-2">
                    <div className="flex flex-col border px-4 py-2 rounded-xl gap-1">
                      <div className="countdown font-bold text-2xl flex flex-row gap-2 text-[#666699]">
                        <span
                          style={{ "--value": minutes } as React.CSSProperties}
                        ></span>
                        :{" "}
                        <span
                          style={{ "--value": seconds } as React.CSSProperties}
                        ></span>
                      </div>
                      <div className="flex flex-row justify-center gap-4 text-xs">
                        <div className="">menit</div>
                        <div className="">detik</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col justify center items-center">
                  <div className="py-4">
                    <img
                      src="https://www.loket.com/assets-v2/img/spot-hero-wrong-pin-attempts.svg"
                      alt=""
                    />
                  </div>
                  <span className="text-lg font-bold">
                    Your order has been cancelled.
                  </span>
                  <div>You have exceeded the payment deadline.</div>
                </div>
              )}
              <div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col pt-4 flex-start">
                    <div>Invoice number</div>
                    <div className="uppercase font-bold">{order?.inv_id}</div>
                  </div>
                </div>
              </div>

              <div className="">
                <div className="flex flex-col border p-3 text-md gap-2 rounded-lg w-full">
                  <div className="font-bold flex flex-row gap-2 items-center">
                    <span>
                      <img
                        src="https://assets.loket.com/web/assets/img/ic-wallet.svg"
                        alt=""
                      />
                    </span>{" "}
                    <span>{paymentMethod} </span>
                  </div>
                  <div className="font-semibold">12384178240</div>
                  <div className="border" />
                  <div className="flex-row flex justify-between">
                    <div>Merchant name</div>
                    <div className="font-semibold">TICKZY</div>
                  </div>

                  <div className="flex-row flex justify-between">
                    <div className="">Amount to pay</div>
                    <div className="font-semibold">
                      Rp {order?.total_price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4 pt-4 text-center">
                <div>
                  Please attach your payment proof to confirm your payment.
                </div>

                <input
                  type="file"
                  className="file-input file-input-bordered w-full max-w-xs"
                  disabled={countdown === "Expired"}
                />
                <button
                  className="btn btn-dark"
                  disabled={countdown === "Expired"}
                >
                  Submit
                </button>
              </div>
            </div>

            {/* SECTION TIKET */}

            <div className="flex-col flex w-2/3 border rounded-xl shadow-md h-[280px] justify-center px-8">
              <div className="flex flex-row justify-between">
                <div>
                  Invoice number:
                  <span className="font-semibold"> {order?.inv_id}</span>
                </div>
                <div>
                  {dayjs(order?.createdAt).format("ddd, DD MMM YYYY hh:mm A")}
                </div>
              </div>
              <div className="border-b" />
              <div className="flex flex-row gap-4 pt-3">
                <div className="w-[420px] h-48 relative">
                  <img
                    src={`${imageSrc}${order?.event?.id}`}
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
                        {order?.event.title} (Regular)
                      </div>
                      <div className="text-zinc-600">
                        {order?.total_ticket}{" "}
                        {order?.total_ticket === 1 ? "ticket" : "tickets"}
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
                      {order?.event.location}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Invoice;
