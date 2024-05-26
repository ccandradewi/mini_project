import { AppDispatch, store } from "@/lib/redux/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = (): AppDispatch => useDispatch();
export const useAppSelector:  TypedUseSelectorHook<RootState> = useSelector;