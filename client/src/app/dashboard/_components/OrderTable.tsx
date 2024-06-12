"use client";
import React, { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios.config";
import dayjs from "dayjs";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

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
  const [sortColumn, setSortColumn] = useState<keyof Order>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchOrderData = async () => {
    try {
      const response = await axiosInstance().get("/orders/seller/myOrder");
      const ordersData: Order[] = response.data.data;

      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return dayjs(dateString).format("DD/MM/YY HH:mm");
  };

  const handleSort = (column: keyof Order) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  return (
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-center text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 cursor-pointer"
            onClick={() => handleSort("id")}
          >
            <span style={{ display: "inline-block" }}>ID No </span>
            <span style={{ display: "inline-block" }}>
              {sortColumn === "id" ? (
                sortDirection === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </span>
          </th>
          <th
            scope="col"
            className="px-6 py-3 cursor-pointer"
            onClick={() => handleSort("buyer_id")}
          >
            <span style={{ display: "inline-block" }}>Username </span>
            <span style={{ display: "inline-block" }}>
              {sortColumn === "buyer_id" ? (
                sortDirection === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </span>
          </th>
          <th
            scope="col"
            className="px-6 py-3 cursor-pointer"
            onClick={() => handleSort("event")}
          >
            <span style={{ display: "inline-block" }}>Event Title </span>
            <span style={{ display: "inline-block" }}>
              {sortColumn === "event" ? (
                sortDirection === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </span>
          </th>
          <th
            scope="col"
            className="px-6 py-3 cursor-pointer"
            onClick={() => handleSort("total_ticket")}
          >
            <span style={{ display: "inline-block" }}>Total Tickets </span>
            <span style={{ display: "inline-block" }}>
              {sortColumn === "total_ticket" ? (
                sortDirection === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </span>
          </th>
          <th
            scope="col"
            className="px-6 py-3 cursor-pointer"
            onClick={() => handleSort("createdAt")}
          >
            <span style={{ display: "inline-block" }}>Order Date </span>
            <span style={{ display: "inline-block" }}>
              {sortColumn === "createdAt" ? (
                sortDirection === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </span>
          </th>
          <th
            scope="col"
            className="px-6 py-3 cursor-pointer"
            onClick={() => handleSort("payment_date")}
          >
            <span style={{ display: "inline-block" }}>Payment Date </span>
            <span style={{ display: "inline-block" }}>
              {sortColumn === "payment_date" ? (
                sortDirection === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </span>
          </th>
          <th
            scope="col"
            className="px-6 py-3 cursor-pointer"
            onClick={() => handleSort("status")}
          >
            <span style={{ display: "inline-block" }}>Status </span>
            <span style={{ display: "inline-block" }}>
              {sortColumn === "status" ? (
                sortDirection === "asc" ? (
                  <FaSortUp />
                ) : (
                  <FaSortDown />
                )
              ) : (
                <FaSort />
              )}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr
            key={order.id}
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 "
          >
            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {order.id}
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
                  ? "text-[#5D9B76] font-semibold"
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
  );
}

export default OrderTable;
