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
    <div>
      <h1>Verifying your email.. </h1>
    </div>
  );
};

export default VerifyEmail;
