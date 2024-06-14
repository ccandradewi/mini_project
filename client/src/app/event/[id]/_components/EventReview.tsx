// EventReview.tsx
import React from "react";
import { IoStar } from "react-icons/io5";
import dayjs from "dayjs";

interface EventReviewProps {
  rating: number;
  username: string;
  reviewText: string;
  reviewDate: string;
}

const EventReview: React.FC<EventReviewProps> = ({
  rating,
  username,
  reviewText,
  reviewDate,
}) => {
  const censorUsername = (name: string) => {
    const length = name.length;
    const visiblePart = name.slice(0, Math.max(0, length - 3));
    return `${visiblePart}***`;
  };

  return (
    <div className="border-t mt-4 pt-4">
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, index) => (
          <IoStar
            key={index}
            className={`text-xl ${
              index < rating ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="font-bold text-sm">{censorUsername(username)}</div>
      <div className="text-sm text-gray-700 mb-2">{reviewText}</div>
      <div className="text-sm text-gray-500">
        {dayjs(reviewDate).format("DD MMMM YYYY")}
      </div>
    </div>
  );
};

export default EventReview;
