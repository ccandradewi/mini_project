// src/pages/_app.tsx
"use client";
import React from 'react';
import { AppProps } from 'next/app';
import 'bootstrap/dist/css/bootstrap.min.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <h1>Ini homepage</h1>
  );
};

export default MyApp;
