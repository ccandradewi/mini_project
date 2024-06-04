// components/LocationDropdown.js
import React from "react";
import { locations } from "./Locations";

const LocationDropdown = ({}) => {
  return (
    <div className="">
      <div className="">
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Filter by Location
        </label>

        <select
          id="location"
          name="location"
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All Locations</option>
          {locations.map(({ name, displayName }) => (
            <option key={name} value={name}>
              {displayName}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationDropdown;
