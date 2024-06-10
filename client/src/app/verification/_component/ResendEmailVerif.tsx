"use client";

import { useAppSelector } from "@/app/hooks";
import { axiosInstance } from "@/lib/axios.config";
import { TUser } from "@/models/user.model";
import { useState } from "react";

export default function ResendEmailVerif() {
  const [responseMessage, setResponseMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { email } = useAppSelector((state) => state.auth) as TUser;
  const resendVerif = async () => {
    try {
      const response = await axiosInstance().post(
        "/users/resendVerificationEmail",
        { email: email },
        { headers: { "Content-Type": "application/json" } }
      );
      setResponseMessage(response.data.message);
      setUserEmail(response.data.email);
    } catch (error) {
      console.log("Error caling API");
      setResponseMessage("API call failed");
    }
  };
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
      <div className="max-w-xl px-5 text-center">
        <h2 className="mb-2 text-[42px] font-bold text-zinc-800">
          Thankyou for register your account. Please Verify your email
        </h2>
        <p className="mb-2 text-lg font-medium text-zinc-500">
          {"Didn't get email? "}
        </p>
        <button
          onClick={resendVerif}
          className="mt-3 inline-block w-96 rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
        >
          Resend Verification
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
