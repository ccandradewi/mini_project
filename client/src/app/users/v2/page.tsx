"use client";
import React from 'react';
import LoginForm from './_component/LoginForm';
import { store } from '@/lib/redux/store';
import { Provider } from "react-redux";


export default function LoginPage() {
  return (
    <Provider store={store}>
    <LoginForm/>
    </Provider>
  )
}
