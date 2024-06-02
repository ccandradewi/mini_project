"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "@/lib/redux/slices/user.slice";
import { TUser } from "@/models/user.model";

type Props = {};

export default function Navbar({}: Props) {
  const loggedinUser = useAppSelector((state) => state.auth) as TUser;
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const loginButton = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push("/auth/login");
  };

  const registerButton = (event: React.MouseEvent) => {
    event.preventDefault();
    router.push("/auth/register");
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl px-4 flex flex-row py-3">
        {/* LOGO */}
        <div className="flex items-center w-[100px]">
          <img
            src="https://i.ibb.co.com/yqxWWt2/Tickzy-2.png"
            alt="tickzy logo"
          />
        </div>

        {/* // SEARCH */}
        <div className="flex items-center space-x-4 flex-grow">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search"
              className="block w-full py-2 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {loggedinUser.username && (
            <div className="text-gray-700">
              Welcome, {loggedinUser.first_name}
            </div>
          )}
          {loggedinUser.username ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300"
                id="user-menu-button"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full"
                  src={
                    loggedinUser.avatar ||
                    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                  }
                  alt="User Avatar"
                />
              </button>
              {dropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button"
                  tabIndex={-1}
                >
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0"
                  >
                    Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-1"
                  >
                    Settings
                  </a>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-2 ml-auto">
              {" "}
              {/* Utilizing ml-auto */}
              <button
                className="bg-[#5180C6] hover:bg-[#3c567e] text-white font-bold px-4 py-2 rounded"
                onClick={loginButton}
              >
                Login
              </button>
              <button
                className="bg-[#c0b3ad] hover:bg-[#e4dbd7] text-white font-bold px-4 py-2 rounded"
                onClick={registerButton}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
