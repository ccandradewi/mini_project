import { TUser } from "./user.model";
import { PaymentMethod, StatusOrder } from "@prisma/client";

export type TOrder = {
  id: string;
  user: TUser;
  eventId: string;
  totalTicket: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  paymentProof?: Buffer | null;
  date: Date;
  paymentDate?: Date;
  status: StatusOrder;
  createdAt?: Date;
  updatedAt?: Date;
} | null;
