import { TUser } from "@/models/user.model";
import { initialUser } from "../initial";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { deleteCookie } from "cookies-next";

export const userSlice = createSlice({
    name: "auth",
    initialState: initialUser as TUser,
    reducers: {
        login: (state, action: PayloadAction<TUser>) => {
            state = { ...state, ...action.payload };
            return state;
        },
        logout: (state) => {
            deleteCookie("access_token");
            deleteCookie("refresh_token");

            state = initialUser;
            
            return state;
        },
    },
});

export const { login, logout }  = userSlice.actions;
export default userSlice.reducer;