"use client";
import { axiosInstance } from "@/lib/axios.config";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { imageSrc } from "@/utils/image.render";
import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";
import { useAppSelector } from "@/app/hooks";
import { TUser } from "@/models/user.model";
import Swal from "sweetalert2";

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

interface VoucherPoint {
  id: string;
  user_id: string;
  point: number;
  expired_date: string;
  voucher: number;
  isValid: boolean;
  createdAt: string;
}

function DetailCheckouts() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [event, setEvent] = useState<Event | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [voucherPoints, setVoucherPoints] = useState<VoucherPoint[] | null>(
    null
  );
  const [usePoints, setUsePoints] = useState(false);
  const [useVoucher, setUseVoucher] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [discAmount, setDiscAmount] = useState(0);

  const buyer = useAppSelector((state) => state.auth) as TUser;
  const buyerId = buyer.id;

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!id) return;

        const response = await axiosInstance().get(`/event/detail/${id}`);
        const { data } = response.data;
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    fetchEventData();
  }, [id]);

  useEffect(() => {
    const fetchVoucherPoints = async () => {
      try {
        const response = await axiosInstance().get(`/orders/vp/${buyerId}`);
        const { data } = response.data;
        setVoucherPoints(data as VoucherPoint[]);
        console.log("data", data);
        console.log("buyer id in vp:", buyerId);
      } catch (error) {
        console.error("Error fetching voucher points:", error);
      }
    };

    fetchVoucherPoints();
  }, [buyerId]);

  const handleIncrement = () => {
    if (ticketCount < 3) {
      setTicketCount(ticketCount + 1);
    }
  };

  const handleDecrement = () => {
    if (ticketCount > 1) {
      setTicketCount(ticketCount - 1);
    }
  };

  const discountPrice = event?.discount_price ?? 0;
  const ticketPrice = event?.promo ? discountPrice : event?.ticket_price ?? 0;
  const subtotal = event?.promo
    ? ticketCount * (event.discount_price ?? 0)
    : ticketCount * ticketPrice;

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPaymentMethod(e.target.value);
  };

  const handleUsePointsChange = () => {
    if (useVoucher) {
      Swal.fire({
        icon: "warning",
        title: "Cannot use both voucher and points",
        text: "Please uncheck your voucher before using points!",
      });
      return;
    }
    setUsePoints(!usePoints);
  };

  const handleUseVoucherChange = () => {
    if (usePoints) {
      Swal.fire({
        icon: "warning",
        title: "Cannot use both voucher and points",
        text: "Please uncheck your points before using voucher! You cannot use both points and voucher at the same time!",
      });
      return;
    }
    setUseVoucher(!useVoucher);
  };

  useEffect(() => {
    if (usePoints && voucherPoints) {
      const pointsUsed = voucherPoints[0]?.point || 0;
      console.log("Points Used:", pointsUsed);
      setDiscAmount(Math.min(subtotal, pointsUsed));
      setUseVoucher(false);
    } else if (useVoucher && voucherPoints) {
      const voucherUsed = voucherPoints[0]?.voucher || 0;
      console.log("Voucher Used:", voucherUsed);
      const calcVoucher = subtotal * 0.1;
      setDiscAmount(calcVoucher);
      setUsePoints(false);
    } else {
      setDiscAmount(0);
    }
  }, [usePoints, useVoucher, subtotal, voucherPoints]);

  const totalPrice =
    event?.type === "FREE"
      ? 0
      : Math.max(0, ticketCount * ticketPrice - discAmount);

  const handlePayNow = async () => {
    const totalTicket = ticketCount;
    const pointsUsed =
      usePoints && voucherPoints
        ? Math.min(subtotal, voucherPoints[0]?.point || 0)
        : 0;
    const updatedPoints =
      usePoints && voucherPoints
        ? (voucherPoints[0]?.point || 0) - pointsUsed
        : 0;

    const totalPrice =
      event?.type === "FREE"
        ? 0
        : Math.max(0, ticketCount * ticketPrice - discAmount);

    if (totalPrice > 0 && !paymentMethod) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please choose your preferred payment method!",
      });
      return;
    }
    const data = {
      buyer_id: buyerId,
      event_id: event?.id,
      total_ticket: totalTicket,
      payment_method: paymentMethod,
      total_price: totalPrice,
      status: totalPrice === 0 ? "confirmed" : "pending",
      use_point: usePoints,
      use_voucher: useVoucher,
      updated_points: updatedPoints,
    };

    console.log("data to be sent:", data);

    try {
      const response = await axiosInstance().post("/orders", data);
      console.log("order successful:", response);

      const orderData = response.data.data;
      if (!orderData || !orderData.id) {
        throw new Error("id is undefined");
      }

      const orderId = orderData.id;
      console.log("ID from recent order:", orderId);

      if (totalPrice === 0) {
        // For free events, redirect to success page
        router.push(`/success`);
      } else {
        // For paid events, redirect to invoice page
        router.push(`/invoice/${orderId}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const handleBackToEventDetail = () => {
    // Replace '/event-detail' with the actual route for event detail
    router.push(`/event/${event?.id}`);
  };

  return (
    <>
      <div>
        {/* BREADCRUMBS */}
        <div className="text-sm breadcrumbs px-2 pt-10">
          <ul>
            <li>
              <a href="/" className="text-black no-underline">
                Home
              </a>
            </li>
            {event?.title && (
              <>
                <li>
                  <a
                    onClick={handleBackToEventDetail}
                    className="text-black no-underline cursor-pointer"
                  >
                    {event?.title}
                  </a>
                </li>
                <li className="font-semibold text-[#B31312]">Buy Ticket</li>
              </>
            )}
          </ul>
        </div>

        <div className="flex flex-col px-10">
          <div className="flex flex-col gap-3">
            <div className="text-zinc-500">Select your tickets for</div>
            <div className="text-3xl font-bold">{event?.title}</div>

            <div>
              Tickets for {dayjs(event?.start_time).format("DD MMMM YYYY")} -{" "}
              {dayjs(event?.end_time).isSame(event?.start_time, "day")
                ? dayjs(event?.start_time).format("HH:mm")
                : dayjs(event?.end_time).format("DD MMMM YYYY")}
            </div>
          </div>

          <div className="flex flex-row gap-4 py-4">
            {/* SECTION TICKET */}
            <div className="w-2/3 flex flex-row justify-between rounded-xl p-4 border-1 items-start h-80">
              <div className="flex-col justify-between flex h-full">
                <div className="flex flex-col gap-2">
                  <div className="font-bold text-lg">REGULAR</div>
                  <div className="flex flex-row items-center gap-2">
                    <IoCalendarOutline />{" "}
                    {dayjs(event?.start_time).format("DD MMMM YYYY")}
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <IoLocationOutline /> {event?.venue}
                  </div>
                </div>
                <div>
                  <div className="flex flex-row items-center gap-3 text-lg">
                    <button
                      className="w-10 btn btn-dark"
                      onClick={handleDecrement}
                      disabled={ticketCount <= 1}
                    >
                      -
                    </button>
                    <div>{ticketCount}</div>
                    <button
                      className="w-10 btn btn-dark"
                      onClick={handleIncrement}
                      disabled={ticketCount >= 3}
                    >
                      +
                    </button>
                  </div>
                  <div className="text-xs pt-2 text-zinc-600">
                    Max 3 tickets per user
                  </div>
                </div>
              </div>
              <div className="w-60 h-48 relative">
                <img
                  src={`${imageSrc}${event?.id}`}
                  alt="Event Banner"
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
            </div>

            {/* SECTION ORDER SUMMARY */}
            <div className="w-1/3 flex flex-col gap-2 p-4 border-1 rounded-xl justify-center">
              <div className="font-semibold text-xl">Order summary</div>
              <div className="flex flex-row justify-between">
                <div>Subtotal</div>
                <div>Rp {subtotal.toLocaleString()}</div>
              </div>
              <div className="flex flex-row justify-between">
                <div>Discount</div>
                <div className="">Rp {discAmount.toLocaleString()}</div>
              </div>
              <div className="border-b" />
              <div className="flex flex-row justify-between font-semibold mb-2">
                <div>Total ({ticketCount} tickets)</div>
                <div>Rp {totalPrice.toLocaleString()}</div>
              </div>
              <div className="p-2">
                {event?.type !== "FREE" &&
                  voucherPoints &&
                  voucherPoints.length > 0 && (
                    <div className="flex flex-col gap-3">
                      {voucherPoints && voucherPoints.length > 0 && (
                        <div className="flex flex-col">
                          {voucherPoints.some((vp) => vp.voucher > 0) && (
                            <div className="p-3 rounded-lg border flex flex-row items-center gap-3 shadow-md hover:bg-zinc-100">
                              <input
                                type="checkbox"
                                id="use-voucher"
                                checked={useVoucher}
                                onChange={handleUseVoucherChange}
                              />
                              <div>
                                <label
                                  htmlFor="use-voucher"
                                  className="font-bold"
                                >
                                  Use my voucher
                                </label>
                                <div className="text-sm">Get 10% off</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {voucherPoints && voucherPoints.length > 0 && (
                        <div className="flex flex-col">
                          {voucherPoints.some((vp) => vp.point > 0) && (
                            <div className=" p-3 rounded-lg border shadow-md flex flex-row items-center gap-3 hover:bg-zinc-100">
                              <input
                                type="checkbox"
                                id="use-points"
                                checked={usePoints}
                                onChange={handleUsePointsChange}
                              />
                              <div>
                                <label
                                  htmlFor="use-points"
                                  className="font-bold"
                                >
                                  Use my membership points!
                                </label>
                                <div>
                                  {voucherPoints.map((vp) => (
                                    <div key={vp.id} className="text-sm">
                                      <b className="text-[#EA906C]">
                                        {vp.point.toLocaleString()}
                                      </b>{" "}
                                      points will be invalid by{" "}
                                      {dayjs(vp.expired_date).format(
                                        "DD MMMM YYYY"
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
              </div>
              {totalPrice > 0 && (
                <div>
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <select
                    id="paymentMethod"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                    className="w-full mt-2 mb-4 p-2 border rounded"
                  >
                    <option value="" disabled>
                      Select a payment method*
                    </option>
                    <option value="virtualaccount">Virtual Account</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="gopay">Gopay</option>
                    <option value="shopeepay">Shopeepay</option>
                  </select>
                </div>
              )}
              <button onClick={handlePayNow} className="btn btn-dark">
                {totalPrice === 0 ? "Get tickets" : "Pay now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailCheckouts;
