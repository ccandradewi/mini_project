"use client";

import { useAppSelector } from "@/app/hooks";
import { axiosInstance } from "@/lib/axios.config";
import { TUser } from "@/models/user.model";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function ResendEmailVerif() {
  const searchParams = useSearchParams();
  const [responseMessage, setResponseMessage] = useState("");
  const { email } = useAppSelector((state) => state.auth) as TUser;
  let userEmail: string | undefined = email || undefined;
  if (!userEmail) {
    const emailParam: string | null = searchParams.get("email");
    if (emailParam) {
      userEmail = emailParam;
    }
  }
  const resendVerif = async () => {
    try {
      const response = await axiosInstance().post(
        "/users/resendVerificationEmail",
        { email: userEmail },
        { headers: { "Content-Type": "application/json" } }
      );
      setResponseMessage(response.data.message);
      Swal.fire({
        title: "Success!",
        text: "Email has been sent. Please check your box",
        icon: "success",
      });
    } catch (error) {
      console.log("Error caling API");
      setResponseMessage("API call failed");
    }
  };
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
      <div className="max-w-xl px-3 text-center flex flex-col items-center">
        <a className="w-[130px] py-4">
          <img
            src="https://i.ibb.co.com/cCF1xH7/Tickzy-3.png"
            alt="tickzy logo"
          />
        </a>
        <h2 className="pb-4 text-[42px] font-bold text-zinc-800">
          Thank you for signing up!
        </h2>
        <h2 className=" text-xl font-semibold text-zinc-800">
          Please check your e-mail and verify your account
        </h2>
        <h2 className="pb-4 text-xl font-semibold text-zinc-800">
          to continue browsing events in Tickzy.
        </h2>

        <p className="mb-2 text-lg font-medium text-zinc-500">
          {"Didn't get e-mail? "}
        </p>
        <button onClick={resendVerif} className="btn btn-dark my-4">
          Resend e-mail
        </button>
        {responseMessage && (
          <div className="mt-10 text-center font-medium text-blue-600">
            <p>{responseMessage}</p>
            {userEmail && <p>Email: {userEmail}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
