import {
  Event,
  Gender,
  Order,
  Review,
  Role,
  VoucherPoint,
} from "@prisma/client";

export type TUser = {
  id?: String;
  email?: String;
  password?: String;
  role?: Role;
  username?: String;
  first_name?: String;
  last_name?: String;
  phone_number?: String;
  address?: String;
  gender?: Gender;
  dob?: Date;
  avatar?: String;
  referral_code?: String;
  reference_code?: String;
  createdAt?: Date;
  updatedAt?: Date;
  VoucherPoint: VoucherPoint[];
  Event: Event[];
  Order: Order[];
  Review: Review[];
} | null;
