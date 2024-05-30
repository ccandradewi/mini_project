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
      await axiosInstance().post(
        "users/v2",
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const access_token = getCookie("access-token") || "";
      console.log(access_token);

      // if (access_token) {
      //   const user: TUser = jwtDecode(access_token);
      //   dispatch(login(user));
      // }
      // return;
    } catch (err) {
      if (err instanceof Error) {
        console.log(err.message);

        deleteCookie("access_token");
        alert("Wrong email/password");
      }
    }
  };
};

export const keepLogin = (storage: any) => {
  return async (dispatch: Dispatch) => {
    try {
      const token = getCookie("access_token");
      if (token) {
        dispatch(login(jwtDecode(token)));
      }
      // const res = await axiosInstance().get("/users", {
      //   params: { username: storage.username },
      // });
      // const user: TUser = res.data[0];

      // if (user.id) {
      //   dispatch(login(user));
      // }
      // return;
    } catch (err: any) {
      deleteCookie("access_token");
      // window.location.reload();
      // return err.message;
    }
  };
};
