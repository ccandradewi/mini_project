"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface EventChartProps {
  data: {
    eventId: string;
    title: string;
    totalTicketsSold: number;
    availability: number;
  }[];
}

const getLabel = (value: number) => {
  return value === 0 ? "Sold Out" : value.toString();
};

const EventChart: React.FC<EventChartProps> = ({ data }) => {
  const chartData = {
    labels: data.map((event) => event.title),
    datasets: [
      {
        label: "Tickets Sold",
        data: data.map((event) => event.totalTicketsSold),
        backgroundColor: "#EA906C",
        barThickness: 10,
      },
      {
        label: "Remaining Tickets",
        data: data.map((event) => event.availability),
        backgroundColor: "#666699",
        barThickness: 10,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const, // This makes the chart horizontal
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Event Tickets",
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.raw;
            const availability = data[context.dataIndex].availability;

            if (label === "Remaining Tickets" && availability === 0) {
              return `Sold Out`;
            } else {
              return `${label}: ${getLabel(value)}`;
            }
          },
        },
      },
    },
    scales: {
      x: {
        type: "logarithmic" as const,
        title: {
          display: true,
          text: "Number of Tickets",
        },
        ticks: {
          callback: function (value: string | number) {
            const tickValue = Number(value);
            if (
              [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].includes(tickValue)
            ) {
              return tickValue;
            }
            return null;
          },
        },
      },
    },
  };

  return (
    <div className="">
      {" "}
      {/* Adjusted height here */}
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default EventChart;
