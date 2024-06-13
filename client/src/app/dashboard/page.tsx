import React from "react";
import Metrics from "./_components/Metrics";
import OrderTable from "./_components/OrderTable";

function page() {
  return (
    <>
      <div className="flex flex-col gap-8 px-8">
        <Metrics />
        <div className="border-b" />
        <OrderTable />
      </div>
    </>
  );
}

export default page;
