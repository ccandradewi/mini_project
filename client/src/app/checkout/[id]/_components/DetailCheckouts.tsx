"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios.config";

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

function DetailCheckouts() {
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
        setEvent(data);
        console.log(data);
      } catch (error) {
        console.error("error fetching", error);
      }
    };

    fetchEventData();
  }, [id]);

  return <>ini page checkout untuk event: {event?.title}</>;
}

export default DetailCheckouts;
