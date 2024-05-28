"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/lib/axios.config";
import { TUser } from "@/models/user.model";
import { getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {

  const router = useRouter();
  const [user, setUser] = useState<TUser | null>(null);

  const logout = async ()  => {
    try {
      const response = await axiosInstance().post("/users/logout");
  
      if (response.status === 200) {
        console.log("Logout successful");
        setUser(null);
        router.push("/")
      } else {
        console.log("Logout error");
      }
    } catch (error) {
      console.log("Error during logout", error)
    }
  }

  const handleLogout = async () => {
    await logout();
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = getCookie("access_token") as string;
        if (token) {
          const decodedToken = jwtDecode<TUser>(token);
          setUser(decodedToken);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log("Error fetching current user", error);
        setUser(null);
      }
    };
  
    fetchCurrentUser();
  }, []);

  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl text-blue-700">MINPRO.COM</a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-24 md:w-auto"
          />
        </div>
        <div>
          {user ? <h2>Welcome, {user.username}</h2> : <h2>Please log in</h2>}
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
             
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a
              onClick={handleLogout}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};