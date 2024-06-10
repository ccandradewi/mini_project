import { useRouter } from "next/navigation";
import React from "react";
import { IoPricetagOutline } from "react-icons/io5";
import dayjs from "dayjs"; // Make sure to import dayjs for date formatting

interface TicketCardProps {
  title?: string;
  price?: number;
  discountPrice?: number;
  id?: string;
  endPromo?: string;
  type?: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  title,
  price,
  discountPrice,
  id,
  endPromo,
  type,
}) => {
  const router = useRouter();

  const handleBuyTickets = () => {
    if (id) {
      router.push(`/checkouts/${id}`);
    }
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  return (
    <div className="border flex flex-col rounded-lg shadow-md overflow-hidden p-4 w-[400px]">
      <div className="font-bold text-xl mb-2">{title || "Event Title"}</div>
      <div className="flex items-center mb-2">
        <IoPricetagOutline className="mr-1" />
        {type === "FREE" ? (
          <span>FREE</span>
        ) : discountPrice ? (
          <>
            <span className="line-through mr-2">
              {price !== undefined ? formatPrice(price) : "N/A"}
            </span>
            <span className="text-red-500">{formatPrice(discountPrice)}</span>
          </>
        ) : (
          <span>{price !== undefined ? formatPrice(price) : "N/A"}</span>
        )}
      </div>
      {discountPrice && endPromo && (
        <div className="text-sm text-gray-500 mb-2">
          Discount only until {dayjs(endPromo).format("DD MMMM YYYY")}
        </div>
      )}
      <div className="flex flex-row justify-between">
        <button
          className="px-4 py-2 bg-[#2B2A4C] text-white rounded-lg"
          onClick={handleBuyTickets}
        >
          Buy Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
