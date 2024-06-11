"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { axiosInstance } from "@/lib/axios.config";

const VerifyEmail = () => {
  const router = useRouter();
  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axiosInstance().get(
            `/users/verification/${token}`
          );

          if (response.status === 200) {
            router.push("/auth/login");
          } else {
            console.error("Email verification failed:", response.statusText);
          }
        } catch (error) {
          console.error("Error verifying email:", error);
        }
      }
    };

    verifyToken();
  }, [token, router]);

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [token, router]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <div>
          <img
            src="https://i.ibb.co.com/7z86RmZ/otp-security.png"
            alt="verification"
            className="w-[300px]"
          />
        </div>
        <div className="font-bold text-3xl py-4">Verifying your email...</div>
        <div className="text-zinc-600 text-xl">
          You will be redirected to the login page.
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
