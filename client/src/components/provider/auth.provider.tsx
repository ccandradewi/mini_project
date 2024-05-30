"use client";
import { getValidAuthTokens } from "@/lib/cookie";
import { TUser } from "@/models/user.model";
import { keepLogin } from "@/lib/redux/middleware/auth.middleware";
import { useEffect } from "react";
import { useAppDispatch } from "@/app/hooks";

export default function AuthProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  // const dispatch = useAppDispatch();
  // const { data } = getValidAuthTokens();
  // const fetchUser = async (storage: TUser) =>
  //   await dispatch(keepLogin(storage));
  // useEffect(() => {
  //   if (data) fetchUser(data);
  // }, []);
  return children;
}
