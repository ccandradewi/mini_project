"use client";
import React from "react";
import { FiGrid, FiCalendar, FiUser, FiLogOut } from "react-icons/fi";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { TUser } from "@/models/user.model";
import { logout } from "@/lib/redux/slices/user.slice";
import { useParams, useRouter } from "next/navigation";

const Sidebar2 = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const params = useParams();
  const { id } = params;
  console.log("Params:", params);

  // const handleLogout = () => {
  //   dispatch(logout());
  //   router.push("/");
  //   window.location.reload();
  // };
  const onLogoutHandle = async () => {
    await dispatch(logout());
    router.push("/");
  };
  const handleTicket = () => {
    console.log("Navigating to My Ticket");
    router.push(`/member/my-ticket`);
  };
  const handleAccount = () => {
    router.push("/member/profile");
  };
  const loggedinUser = useAppSelector((state) => state.auth) as TUser;

  return (
    <div className="w-64 h-screen bg-[#2B2A4C] text-white flex flex-col justify-between">
      <div>
        <div className="flex justify-center items-center p-6">
          <div className="w-[100px]">
            <img
              src="https://i.ibb.co.com/XWMvj0b/Tickzy-1.png"
              alt="tickzy logo"
            />
          </div>
        </div>
        <div className="border-t border-gray-700 mb-6"></div>
        <div className="mb-6">
          <p className="text-xs font-semibold px-6 mb-2">Dashboard</p>
          <button
            className="w-full text-left px-6 py-2 flex items-center hover:bg-gray-700 focus:outline-none"
            onClick={() => router.push("/")}
          >
            <FiGrid className="mr-2" /> Dashboard
          </button>
          <button
            className="w-full text-left px-6 py-2 flex items-center hover:bg-gray-700 focus:outline-none
        "
            onClick={handleTicket}
          >
            <FiCalendar className="mr-2" /> My Ticket
          </button>
        </div>
        <div className="border-t border-gray-700 my-6"></div>
        <div>
          <p className="text-xs font-semibold px-6 mb-2">Profile</p>
          <button
            className="w-full text-left px-6 py-2 flex items-center hover:bg-gray-700 focus:outline-none"
            onClick={handleAccount}
          >
            <FiUser className="mr-2" /> Account Settings
          </button>
        </div>
        <div>
          <button
            className="w-full text-left px-6 py-2 flex items-center hover:bg-gray-700 focus:outline-none
      "
            onClick={onLogoutHandle}
          >
            <FiLogOut className="mr-2" /> Sign Out
          </button>
        </div>
      </div>
      <div className="border-t border-gray-700 flex flex-row gap-4 items-center px-6 py-4">
        <div>
          <img
            src={
              loggedinUser.avatar ||
              "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
            }
            alt="User profile"
            className="w-10 h-10 rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <div className="text-xs font-semibold">Event Organizer</div>
          <div className="text-lg font-base">{loggedinUser.username}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar2;
