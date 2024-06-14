import { User, Order, Event } from "@prisma/client";

export type TReview = {
  id: string;
  user_id: string;
  user: User;
  order_id: string;
  order: Order;
  event_id: string;
  event: Event;
  description: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
} | null;
