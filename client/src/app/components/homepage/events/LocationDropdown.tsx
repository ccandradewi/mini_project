"use client";
import React from "react";

interface LocationDropdownProps {
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  setSelectedCity,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  };

  return (
    <div className="">
      <div className="">
        <label
          htmlFor="city"
          className="block text-sm font-medium text-gray-700"
        >
          Filter by City
        </label>

        <select
          id="city"
          name="city"
          onChange={handleChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">All Cities</option>
          <option value="JABODETABEK">Jabodetabek</option>
          <option value="JAWA">Pulau Jawa</option>
          <option value="SUMATRA">Pulau Sumatra</option>
          <option value="KALIMANTAN">Pulau Kalimantan</option>
          <option value="SULAWESI">Sulawesi</option>
          <option value="BALI_NUSA_TENGGARA">Bali dan Nusa Tenggara</option>
          <option value="PAPUA_MALUKU">Papua dan Maluku</option>
        </select>
      </div>
    </div>
  );
};

export default LocationDropdown;
