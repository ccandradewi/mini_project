import React from "react";
import { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import EventHero from "./components/homepage/EventHero";
import EventCategory from "./components/homepage/EventCategory";
import LocationDropdown from "./components/homepage/events/LocationDropdown";
import EventSection from "./components/homepage/EventSection";
import Footer from "./components/Footer";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <EventHero />
      <EventCategory />
      {/* <LocationDropdown /> */}
      <EventSection />
      <Footer />
    </div>
  );
}
