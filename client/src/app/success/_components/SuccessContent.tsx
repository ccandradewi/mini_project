"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SuccessContent: React.FC = () => {
  const router = useRouter();

  const handleMyTicket = () => {
    router.push("/member/my-ticket");
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div>
          <img
            src="https://i.ibb.co.com/JddvSpZ/musical-band-performing-2-1.png"
            alt="verification"
            className="w-[500px]"
          />
        </div>
        <div className="font-bold text-3xl py-4">
          Yay, you have successfully bought your ticket!
        </div>
        <div className="text-zinc-600 text-xl">See your ticket here</div>

        <button className="btn btn-dark my-4 " onClick={handleMyTicket}>
          My tickets
        </button>
      </div>
    </div>
  );
};

export default SuccessContent;
