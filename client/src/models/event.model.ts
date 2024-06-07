export type TEvent = {
  id?: string;
  user_id?: string;
  banner?: File | null;
  title?: string;
  description?: string;
  start_time?: Date | string;
  end_time?: Date | string;
  venue?: string;
  city?: string;
  location?: string;
  category?: string;
  promotor?: string;
  type?: "FREE" | "PAID";
  availability?: number;
  ticket_price?: number;
  promo?: "TEN_PERCENT" | "TWENTY_FIVE_PERCENT" | "FIFTY_PERCENT" | "";
  start_promo?: Date | string;
  end_promo?: Date | string;
};

export interface Event {
  id: string;
  user_id: string;
  banner: string;
  title: string;
  description: string;
  city: string;
  location: string;
  type: string;
  category: string;
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
