import { Category, EventLocation, Ticket, User, Promo } from "@prisma/client";

export type TEvent = {
  id: String;
  user_id: User;
  banner: String;
  title: String;
  description: String;
  start_time: Date;
  end_time: Date;
  venue: String;
  location_id: EventLocation;
  category_id: Category;
  promotor: String;
  createdAt?: Date;
  updatedAt?: Date;
  ticket: Ticket[];
  promo: Promo;
} | null;
