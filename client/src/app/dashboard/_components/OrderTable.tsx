"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios.config";
import dayjs from "dayjs";

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
  event: {
    title: string;
  };
  user: {
    username: string;
  };
}

function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [usernameFilter, setUsernameFilter] = useState("");
  const [eventTitleFilter, setEventTitleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [invoiceFilter, setInvoiceFilter] = useState("");

  const fetchOrderData = async () => {
    try {
      const response = await axiosInstance().get("/orders/seller/myOrder");
      const ordersData: Order[] = response.data.data;

      setOrders(ordersData);
      setFilteredOrders(ordersData);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [usernameFilter, eventTitleFilter, statusFilter, invoiceFilter]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD/MM/YY HH:mm");
  };

  const filterOrders = () => {
    const filtered = orders.filter((order) => {
      const usernameMatch = order.user.username
        .toLowerCase()
        .includes(usernameFilter.toLowerCase());
      const eventTitleMatch = order.event.title
        .toLowerCase()
        .includes(eventTitleFilter.toLowerCase());
      const statusMatch = order.status
        .toLowerCase()
        .includes(statusFilter.toLowerCase());
      const invoiceMatch = order.inv_id
        .toLowerCase()
        .includes(invoiceFilter.toLowerCase());

      return usernameMatch && eventTitleMatch && statusMatch && invoiceMatch;
    });

    setFilteredOrders(filtered);
  };

  return (
    <div>
      <div className="flex mb-4">
        <div className="flex flex-col">
          <label htmlFor="" className="text-sm font-semibold mb-2">
            Filter by buyer
          </label>
          <input
            type="text"
            placeholder="Input username..."
            value={usernameFilter}
            onChange={(e) => setUsernameFilter(e.target.value)}
            className="px-4 py-2 border rounded mr-2 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="" className="text-sm font-semibold mb-2">
            Filter by event
          </label>
          <input
            type="text"
            placeholder="Input event..."
            value={eventTitleFilter}
            onChange={(e) => setEventTitleFilter(e.target.value)}
            className="px-4 py-2 border rounded mr-2 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="" className="text-sm font-semibold mb-2">
            Filter by order status
          </label>
          <input
            type="text"
            placeholder="Input status..."
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded mr-2 text-sm"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="" className="text-sm font-semibold mb-2">
            Filter by invoice
          </label>
          <input
            type="text"
            placeholder="Input invoice ID..."
            value={invoiceFilter}
            onChange={(e) => setInvoiceFilter(e.target.value)}
            className="px-4 py-2 border rounded text-sm"
          />
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-sm text-center text-gray-700  bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Invoice
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Event
            </th>
            <th scope="col" className="px-6 py-3">
              Tickets
            </th>
            <th scope="col" className="px-6 py-3">
              Order Date
            </th>
            <th scope="col" className="px-6 py-3">
              Payment Date
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr
              key={order.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {order.inv_id}
              </td>
              <td className="px-6 py-4 text-center">{order.user.username}</td>
              <td className="px-6 py-4 text-center">{order.event.title}</td>
              <td className="px-6 py-4 text-center">{order.total_ticket}</td>
              <td className="px-6 py-4 text-center">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-6 py-4 text-center">
                {formatDate(order.payment_date)}
              </td>
              <td
                className={`px-6 py-4 uppercase text-center ${
                  order.status === "confirmed"
                    ? "text-[#5D9B76]"
                    : order.status === "pending"
                    ? "text-yellow-400"
                    : "text-red-700"
                }`}
              >
                {order.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderTable;
