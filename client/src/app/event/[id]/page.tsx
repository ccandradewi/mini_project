import React from "react";
import EventDetails from "./_components/EventDetails";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/Footer";

function page() {
  return (
    <>
      <Navbar />
      <EventDetails />
      <Footer />
    </>
  );
}

export default page;
