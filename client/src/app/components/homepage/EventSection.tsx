import React from "react";
import LocationDropdown from "./events/LocationDropdown";
import EventCard from "./EventCard";

function EventSection() {
  return (
    <div>
      <div className="flex flex-row py-4">
        <div className="w-1/4 px-10">
          <LocationDropdown />
        </div>
        <div>
          <EventCard />
        </div>
      </div>
    </div>
  );
}

export default EventSection;
