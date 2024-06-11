import React from "react";
import DetailCheckouts from "./_components/DetailCheckouts";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/Footer";

function page() {
  return (
    <>
      <Navbar />
      <DetailCheckouts />
      <Footer />
    </>
  );
}

export default page;
