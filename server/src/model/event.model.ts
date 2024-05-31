import {
  Ticket,
  Promo,
  LocationName,
  CategoryName,
  Order,
  Type,
} from "@prisma/client";

export type TEvent = {
  id: string;
  user_id: string;
  banner: Buffer;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  venue: string;
  city: LocationName;
  location: string;
  category: CategoryName;
  promotor: string;
  type: Type;
  createdAt: Date;
  updatedAt: Date;
  promo?: Promo | null;
  start_promo?: Date | null;
  end_promo?: Date | null;
  order?: Order | null;
};
