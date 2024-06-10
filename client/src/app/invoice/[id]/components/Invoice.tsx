"use client";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios.config";

interface TUser {}

type TOrder = {
  id: string;
  user: TUser;
  eventId: string;
  totalTicket: number;
  totalPrice: number;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
} | null;

function Invoice() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  console.log(id);

  const [order, setOrder] = useState<TOrder>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        if (!id) return;

        const response = await axiosInstance().get(`/orders/${id}`);
        const { data } = response.data;
        setOrder(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, [id]);

  return <div>Invoice details: {order?.id}</div>;
}

export default Invoice;
