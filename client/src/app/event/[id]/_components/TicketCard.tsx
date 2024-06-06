import React, { useState, useEffect } from "react";
import { IoPricetagOutline } from "react-icons/io5";

interface TicketCardProps {
  title?: string;
  price?: number;
  discountPrice?: number;
}

const TicketCard: React.FC<TicketCardProps> = ({
  title,
  price,
  discountPrice,
}) => {
  const [ticketCount, setTicketCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(price === 0 ? 0 : price || 0);
  const isFree = price === 0 || typeof price === "undefined";

  useEffect(() => {
    setTotalPrice(ticketCount * (price === 0 ? 0 : price || 0));
  }, [ticketCount, price]);

  const handleIncrement = () => {
    if (ticketCount < 3) {
      setTicketCount((prevCount) => prevCount + 1);
    } else {
      alert("You can only buy 3 tickets at maximum!");
    }
  };

  const handleDecrement = () => {
    if (ticketCount > 1) {
      setTicketCount((prevCount) => prevCount - 1);
    }
  };

  const handleBuyTicket = () => {
    alert(
      `You have bought ${ticketCount} ticket(s) for a total of ${
        isFree ? "Free" : `Rp ${totalPrice.toLocaleString()}`
      }`
    );
  };

  return (
    <div className="border flex flex-col rounded-lg shadow-md overflow-hidden p-4 w-[400px]">
      <div className="font-bold text-xl mb-2">{title || "Event Title"}</div>

      <div className="flex flex-row justify-between">
        <p className="text-lg mb-4 flex flex-row items-center gap-2">
          <IoPricetagOutline />{" "}
          {isFree
            ? "Free"
            : `Rp ${
                discountPrice
                  ? discountPrice.toLocaleString()
                  : price?.toLocaleString() || "0,00"
              }`}
        </p>
        <p>{ticketCount} ticket</p>
      </div>
      <div className="flex items-center  justify-center mb-4">
        <button className="p-2 border rounded-full" onClick={handleDecrement}>
          -
        </button>
        <span className="px-4">{ticketCount}</span>
        <button className="p-2 border rounded-full" onClick={handleIncrement}>
          +
        </button>
      </div>
      {!isFree && (
        <p className="text-lg font-semibold mb-4">
          Total: Rp {totalPrice.toLocaleString()}
        </p>
      )}
      <button
        className="px-4 py-2 bg-[#2B2A4C] text-white rounded-lg"
        onClick={handleBuyTicket}
      >
        Buy Ticket
      </button>
    </div>
  );
};

export default TicketCard;
