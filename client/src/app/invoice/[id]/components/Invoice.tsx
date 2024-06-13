// "use client";
import { useRouter, useParams, redirect } from "next/navigation";
import { useState, useEffect, ChangeEvent } from "react";
import { axiosInstance } from "@/lib/axios.config";
import dayjs from "dayjs";
import { imageSrc } from "@/utils/image.render";
import {
  IoTicketOutline,
  IoCalendarOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { cookies, headers } from "next/headers";
import { AxiosError } from "axios";
import FormPaymentProofComponent, {
  CountComponent,
  Order,
} from "./count.component";
import { jwtDecode } from "jwt-decode";
import { TUser } from "@/models/user.model";

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

const paymentMethodMap: { [key: string]: string } = {
  bank: "BCA Transfer",
  virtualaccount: "Virtual Account",
  shopeepay: "ShopeePay",
  gopay: "GoPay",
};

async function Invoice({ id }: { id: string }) {
  // const params = useParams();
  // const { id } = params;

  // const [order, setOrder] = useState<Order | null>(null);

  // const [countdown, setCountdown] = useState<string | null>("");
  // const fetchOrderData = async () => {
  //   try {
  //     if (!id) return;

  //     const response = await axiosInstance().get(`/orders/${id}`);
  //     const { data } = response.data;
  //     console.log("respons", response);
  //     console.log(data.event.title);
  //     // setOrder(data);
  //     console.log("Order data:", data);
  //   } catch (error) {
  //     console.error("Error fetching order data:", error);
  //   }
  // };

  const order: Order = await axiosInstance()
    .get(`/orders/${id}`)
    .then((res) => res.data.data)
    .catch((e) => {
      if (e instanceof AxiosError) console.log(e.response?.data);
      return undefined;
    });

  const user = jwtDecode(cookies().get("access_token")?.value!) as TUser;
  if (order.buyer_id != user.id) redirect("/");

  // useEffect(() => {
  //   console.log("cobaaaaaaa");

  //   fetchOrderData();
  // }, [id]);
  // Upload payment Proof

  const paymentMethod =
    paymentMethodMap[order?.payment_method as keyof typeof paymentMethodMap] ||
    order?.payment_method;

  return (
    <>
      <div className="w-screen">
        <div className="px-10">
          <div className="flex flex-row gap-4 lg:p-10">
            {/* SECTION PEMBAYARAN */}
            <div className="flex flex-col w-1/3 justify-center border p-4 rounded-xl gap-2 shadow-md">
              <CountComponent order={order} />

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
                {/* isi form */}
                <FormPaymentProofComponent order={order} />
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
                        {order?.event?.title} (Regular)
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
                      {order?.event?.location}
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
