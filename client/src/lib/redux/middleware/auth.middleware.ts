import { Dispatch } from "@reduxjs/toolkit";
import { axiosInstance } from "../../axios.config";
import { login } from "../slices/user.slice";
import { TUser } from "@/models/user.model";
import { setAuthCookie } from "../../cookie";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

export const userLogin = ({ email, password }: TUser) => {
  return async (dispatch: Dispatch) => {
    try {
      await axiosInstance().post("users/v2",
        {
          email, password,
        },
        {
          withCredentials: true,
        }
      );

      const  access_token = getCookie("access-token") || "";

      if (access_token) {
        const user: TUser = jwtDecode(access_token);
        dispatch(login(user));
      }
      
      return;

      /*
      const res = await axiosInstance().get("/users", {
        params: { username, password },
      });
      const user = res.data[0];
      console.log(user);

      if (user.id) {
        dispatch(login(user));
        setAuthCookie(JSON.stringify(user), "auth");
      }
      return;
      */
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);

        deleteCookie("auth");
        alert("Wrong email/password")
      }
      /*
      if (err instanceof Error) {
      console.log(err.message);
      deleteCookie("auth");
      alert("wrong email/password");
      return err.message;
      */
    }
    }
  };

export const keepLogin = (storage: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const res = await axiosInstance().get("/users", {
        params: { username: storage.username },
      });
      const user: TUser = res.data[0];

      if (user.id) {
        dispatch(login(user));
      }
      return;
    } catch (err: any) {
      deleteCookie("auth");
      window.location.reload();
      return err.message;
      };
    }
  };
