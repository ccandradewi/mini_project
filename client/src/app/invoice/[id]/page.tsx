import React from "react";
import Invoice from "./components/Invoice";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/Footer";

function page() {
  return (
    <>
      <Navbar />
      <Invoice />
      <Footer />
    </>
  );
}

export default page;
