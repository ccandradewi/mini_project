import { axiosInstance } from "@/lib/axios.config";
import { useState } from "react";
interface Event {
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
  availability: string;
  promo: string;
  start_promo: string;
  end_promo: string;
  createdAt: string;
  updatedAt: string;
  venue: string;
}
interface SearchBar {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}
const SearchBar: React.FC<SearchBar> = ({ query, setQuery }) => {
  const [results, setResults] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance().get("/event/title", {
        params: {
          title: query,
        },
      });
      setResults(response.data.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };
  return (
    <div>
      <div className="relative flex">
        <input
          type="search"
          className="relative m-0 -me-0.5 block flex-auto rounded-s border border-solid border-neutral-200 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none dark:border-white/10 dark:text-white dark:placeholder:text-neutral-200 dark:autofill:shadow-autofill dark:focus:border-primary"
          aria-label="Search"
          id="exampleFormControlInput"
          aria-describedby="basic-addon1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events by title"
        />
        <button
          className="z-[2] inline-block rounded-e border-2 border-primary px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50 hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:text-primary-500 dark:hover:bg-blue-950 dark:focus:bg-blue-950"
          data-twe-ripple-init
          data-twe-ripple-color="white"
          type="button"
          id="button-addon3"
          onClick={handleSearch}
        >
          <span className="[&>svg]:h-5 [&>svg]:w-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </span>
        </button>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        {results.map((event) => (
          <div
            key={event.id}
            onClick={() => handleEventClick(event)}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "16px",
              width: "250px",
              cursor: "pointer",
            }}
          >
            <h3>{event.title}</h3>
            <p>{event.city}</p>
            <p>{new Date(event.start_time).toLocaleString()}</p>
            <p>{event.ticket_price ? `Rp. ${event.ticket_price}` : "Free"}</p>
          </div>
        ))}
      </div>
      {selectedEvent && (
        <div>
          <h2>{selectedEvent.title}</h2>
          <p>{selectedEvent.location}</p>
          <p>{selectedEvent.city}</p>
          <p>
            {new Date(selectedEvent.start_time).toLocaleString()} -{" "}
            {new Date(selectedEvent.end_time).toLocaleString()}
          </p>
          <p>
            {selectedEvent.ticket_price
              ? `Rp. ${selectedEvent.ticket_price}`
              : "Free"}
          </p>
          <p>Promotor: {selectedEvent.promotor}</p>
          {selectedEvent.banner && (
            <img
              src={`data:image/jpeg;base64,${selectedEvent.banner}`}
              alt="Event banner"
              style={{ width: "100%" }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
