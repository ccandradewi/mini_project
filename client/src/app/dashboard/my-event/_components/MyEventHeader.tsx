"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { IoAddCircleSharp } from "react-icons/io5";

function MyEventHeader() {
  const router = useRouter();

  return (
    <>
      <div className="">
        <div className="flex flex-row justify-between items-center px-6">
          <div className="font-bold text-2xl">My Events</div>
          <div className="flex flex-row gap-4 items-center">
            <button
              className="bg-[#EA906C] px-6 py-2 rounded-full shadow-md font-semibold flex flex-row items-center gap-2 hover:bg-[#EEE2DE] duration-100"
              onClick={() => router.push("/dashboard/create")}
            >
              <IoAddCircleSharp /> Create an Event
            </button>
            {/* <div>mail@mail.com</div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyEventHeader;
