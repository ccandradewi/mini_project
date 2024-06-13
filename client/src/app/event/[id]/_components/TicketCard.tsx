import { useRouter } from "next/navigation";
import React from "react";
import { IoPricetagOutline } from "react-icons/io5";
import dayjs from "dayjs";
import Swal from "sweetalert2";

interface TicketCardProps {
  title?: string;
  price?: number;
  discountPrice?: number;
  id?: string;
  endPromo?: string;
  type?: string;
  endTime?: string;
}

const TicketCard: React.FC<TicketCardProps> = ({
  title,
  price,
  discountPrice,
  id,
  endPromo,
  type,
  endTime,
}) => {
  const router = useRouter();

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  const handleBuyTickets = () => {
    if (endTime && new Date() > new Date(endTime)) {
      Swal.fire({
        icon: "error",
        title: "Oops... event has started",
        text: "Ticket sale has already ended!",
      });
    } else {
      if (id) {
        router.push(`/checkout/${id}`);
      }
    }
  };

  return (
    <div className="border flex flex-col rounded-lg shadow-md overflow-hidden p-4 w-[400px]">
      <div className="font-bold text-xl mb-2">{title || "Event Title"}</div>
      <div className="flex items-center mb-2">
        <IoPricetagOutline className="mr-1" />
        {type === "FREE" ? (
          <span>FREE</span>
        ) : discountPrice && endPromo && new Date() <= new Date(endPromo) ? (
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
      {discountPrice && endPromo && new Date() <= new Date(endPromo) && (
        <div className="text-sm text-gray-500 mb-2">
          Discount only until {dayjs(endPromo).format("DD MMMM YYYY")}
        </div>
      )}
      <div className="flex flex-row justify-between">
        <button className="btn btn-dark" onClick={handleBuyTickets}>
          Buy Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketCard;
