import { TUser } from "./user.model";
import { PaymentMethod, StatusOrder } from "@prisma/client";

export type TOrder = {
  id: string;
  buyer_id: TUser;
  event_id: string;
  total_ticket: number;
  total_price: number;
  payment_method: PaymentMethod;
  payment_proof?: Buffer | null;
  date: Date;
  payment_date?: Date;
  status: StatusOrder;
  createdAt?: Date;
  updatedAt?: Date;
} | null;
