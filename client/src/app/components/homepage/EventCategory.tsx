import React from "react";
import { categories } from "./events/Category";

function EventCategory() {
  return (
    <div className="w-screen">
      <div className="flex flex-row justify-center gap-6 py-4">
        {categories.map((c) => (
          <button
            key={c.name}
            className="flex flex-col items-center justify-center h-28 w-28 hover:bg-zinc-100 hover:rounded-full gap-3"
          >
            <c.icon size={32} />
            <span>{c.displayName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default EventCategory;
