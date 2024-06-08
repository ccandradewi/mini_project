"use client";
import { axiosInstance } from "@/lib/axios.config";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IoLocationOutline, IoCalendarOutline } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { imageSrc } from "@/utils/image.render";
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
}

function DashboardEventDetail() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!id) return;

        const response = await axiosInstance().get(
          `/event/dashboard/detail/${id}`
        );

        const { data } = response.data;

        setEvent(data);
        // setEvent(data);
        console.log(data);

        // const eventData: Event = response.data;
        // setEvent(eventData);
        // console.log(eventData);
      } catch (error) {
        console.error("error fetching", error);
      }
    };

    fetchEventData();
  }, []);

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const handleDeleteEvent = async () => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "No, cancel",
        confirmButtonText: "Yes, delete!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axiosInstance().delete(`/event/${id}`);
            await swalWithBootstrapButtons.fire({
              title: "Deleted!",
              text: "Your event has been deleted.",
              icon: "success",
            });
            router.push("/dashboard/my-event");
          } catch (error) {
            console.error("Error deleting event", error);
            await swalWithBootstrapButtons.fire({
              title: "Error",
              text: "An error occurred while deleting the event",
              icon: "error",
            });
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your event is safe :)",
            icon: "error",
          });
        }
      });
  };

  return (
    <>
      <div className="">
        <div className="lg:px-32 py-6">
          {/* BREADCRUMBS */}
          <div className="text-sm breadcrumbs pt-6">
            <ul>
              <li>
                <a
                  href="/dashboard/my-event"
                  className="text-black  no-underline"
                >
                  My Events
                </a>
              </li>
              <li className="font-semibold text-[#B31312]">{event?.title}</li>
            </ul>
          </div>

          {/* BANNER */}
          <div className="">
            <div className="w-full h-80 px-4 relative">
              <img
                src={`${imageSrc}${event?.id}`}
                alt="Event Banner"
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <div className="p-4 gap-6 flex flex-col">
              <div className="font-bold text-4xl">{event?.title}</div>
              <div className="flex flex-col gap-2">
                <div className="text-lg flex flex-row items-center gap-2 font-semibold">
                  <IoCalendarOutline />{" "}
                  {event?.start_time && event?.end_time
                    ? dayjs(event.start_time).isSame(
                        dayjs(event.end_time),
                        "day"
                      )
                      ? dayjs(event.start_time).format("DD MMMM YYYY")
                      : `${dayjs(event.start_time).format(
                          "DD MMMM YYYY"
                        )} - ${dayjs(event.end_time).format("DD MMMM YYYY")}`
                    : dayjs(event?.start_time).format("DD MMMM YYYY")}
                </div>

                <div className="text-lg font-semibold flex flex-row items-center gap-2">
                  <IoLocationOutline /> {event?.venue}, {event?.location}
                </div>
              </div>

              <div className="text-justify">{event?.description}</div>
            </div>

            <div className="flex flex-col gap-4 p-4 items-center">
              <button
                className="bg-[#EA906C] w-40 px-4 py-2 rounded-full shadow-md font-semibold flex flex-row items-center gap-2 hover:bg-[#EEE2DE] duration-100 text-sm"
                onClick={() => router.push(`/dashboard/edit/${id}`)}
              >
                <FiEdit /> Edit event
              </button>

              <button
                className="bg-[#B31312] w-40 px-4 py-2 rounded-full shadow-md font-semibold flex flex-row items-center gap-2 hover:bg-[#EEE2DE] duration-100 text-white text-sm"
                onClick={handleDeleteEvent}
              >
                <MdDeleteOutline /> Delete event
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashboardEventDetail;
