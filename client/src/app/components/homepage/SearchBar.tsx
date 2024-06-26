import { AiOutlineSearch } from "react-icons/ai";
import { useDebouncedCallback } from "use-debounce";
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
  handleSearch: (query: string) => void;
  searchResults: Event[];
}
const SearchBar: React.FC<SearchBar> = ({ query, setQuery, handleSearch }) => {
  const debouncedSearch = useDebouncedCallback((value) => {
    handleSearch(value);
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
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
          defaultValue={query}
          onChange={handleInputChange}
          placeholder="Search events by title"
        />
        <button
          className="z-[2] inline-block rounded-e border-2 border-primary px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50 hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50 focus:text-primary-600 focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 dark:text-primary-500 dark:hover:bg-blue-950 dark:focus:bg-blue-950"
          data-twe-ripple-init
          data-twe-ripple-color="white"
          type="button"
          id="button-addon3"
          onClick={() => handleSearch(query)}
        >
          <span className="icon">
            <AiOutlineSearch size={20} />
          </span>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
