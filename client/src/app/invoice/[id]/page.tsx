import React from "react";
import Invoice from "./components/Invoice";
import Navbar from "@/app/components/navbar";
import Footer from "@/app/components/Footer";

interface PageProps {
  params: {
    id: string;
  };
}

function Page({ params: { id } }: PageProps) {
  return (
    <>
      <Navbar />
      <Invoice id={id} />
      <Footer />
    </>
  );
}

export default Page;
