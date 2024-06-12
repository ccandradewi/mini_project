"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios.config";
import { AiFillSchedule } from "react-icons/ai";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { IoTicket } from "react-icons/io5";
import EventChart from "./EventChart";

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

interface MetricData {
  totalTicketsSold: number;
  totalEventsHeld: number;
  totalRevenue: number;
  ticketsAndRevenuePerEvent: {
    eventId: string;
    title: string;
    start_time: string;
    end_time: string;
    venue: string;
    totalTicketsSold: number;
    totalRevenue: number;
    availability: number;
  }[];
}

function Metrics() {
  const [metricData, setMetricData] = useState<MetricData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    try {
      const response = await axiosInstance().get("/dashboard/metric");
      const { data } = response.data;
      setMetricData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching metrics data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  if (!metricData) {
    return <div>No data available</div>;
  }

  const metrics = [
    {
      id: 1,
      label: "Total Events",
      value: metricData.totalEventsHeld,
      icon: <AiFillSchedule />,
    },
    {
      id: 2,
      label: "Total Tickets Sold",
      value: metricData.totalTicketsSold,
      icon: <IoTicket />,
    },
    {
      id: 3,
      label: "Total Earnings",
      value: `Rp ${metricData.totalRevenue.toLocaleString()}`,
      icon: <FaMoneyCheckDollar />,
    },
  ];

  return (
    <>
      <div>
        <div className="">
          <div className="flex flex-row justify-center items-center gap-8">
            {/* CHART */}
            <div className="border rounded-lg h-full w-2/3 px-2">
              <EventChart data={metricData.ticketsAndRevenuePerEvent} />
            </div>

            {/* ANGKA TOTAL */}
            <div className="flex flex-col w-1/3 h-full gap-8">
              {metrics.map((metric) => (
                <div
                  key={metric.id}
                  className="flex flex-col border rounded-lg px-4 items-start py-3 w-60"
                >
                  <div className="mb-[30px] text-lg rounded-full bg-zinc-300 p-2 text-[#4f4e75]">
                    {metric.icon}
                  </div>
                  <div className="text-xs">{metric.label}</div>
                  <div className="font-bold text-2xl text-[#4f4e75]">
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Metrics;
