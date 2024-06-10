"use client";
import React, { useState, useEffect } from "react";

import EventCard from "./EventCard";
import { axiosInstance } from "@/lib/axios.config";
import SearchBar from "./SearchBar";

export interface Event {
  id: string;
  user_id: string;
  banner: string;
  title: string;
  description: string;
  city: string;
  location: string;
  type: string;
  category: string;
  promotor: string;
  start_time: string;
  end_time: string;
  ticket_price: number;
  discount_price?: number;
  availability: string;
  promo: string;
  start_promo: string;
  end_promo: string;
  createdAt: string;
  updatedAt: string;
  venue: string;
}

const EventSection: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Event[]>([]);
  // const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  useEffect(() => {
    fetchEventData();
  }, [selectedCity]);

  const fetchEventData = async () => {
    try {
      const response = await axiosInstance().get("/event");
      const eventData: Event[] = response.data.data;
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity);
  };
  const handleSearch = async () => {
    try {
      const response = await axiosInstance().get("/event/title", {
        params: {
          title: query,
        },
      });
      setSearchResults(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  return (
    <div>
      <div className="flex flex-row py-4">
        <div className="w-1/4 px-10">
          <div className="">
            <div className="">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                Filter by Area
              </label>

              <select
                id="city"
                name="city"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  handleCityChange(e.target.value)
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="">All Cities</option>
                <option value="JABODETABEK">Jabodetabek</option>
                <option value="JAWA">Pulau Jawa</option>
                <option value="SUMATRA">Pulau Sumatra</option>
                <option value="KALIMANTAN">Pulau Kalimantan</option>
                <option value="SULAWESI">Sulawesi</option>
                <option value="BALI_NUSA_TENGGARA">
                  Bali dan Nusa Tenggara
                </option>
                <option value="PAPUA_MALUKU">Papua dan Maluku</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 w-3/4">
          <div className="w-3/4">
            <SearchBar
              query={query}
              setQuery={setQuery}
              handleSearch={handleSearch}
              searchResults={searchResults}
              // setSelectedEvent={setSelectedEvent}
            />
          </div>
          <EventCard
            events={events}
            selectedCity={selectedCity}
            searchResults={searchResults}
          />
        </div>
      </div>
    </div>
  );
};

export default EventSection;
