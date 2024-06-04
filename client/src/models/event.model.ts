export type TEvent = {
  id?: string;
  user_id?: string;
  banner?: File | null;
  title?: string;
  desc?: string;
  start_time?: Date;
  end_time?: Date;
  venue?: string;
  city?: string;
  location?: string;
  category?: string;
  promotor?: string;
  type?: string;
  availability?: number;
  ticket_price?: number;
  promo: string;
};
