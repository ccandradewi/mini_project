import {
  Event,
  Gender,
  Order,
  Point,
  Review,
  Role,
  VoucherReferral,
} from "@prisma/client";

export type TUser = {
  id?: String;
  email?: String;
  password?: String;
  role?: Role;
  username?: String;
  first_name?: String;
  Last_name?: String;
  phone_number?: String;
  address?: String;
  gender?: Gender;
  dob?: Date;
  avatar?: String;
  referral_code?: String;
  reference_code: String;
  createdAt?: Date;
  updatedAt?: Date;
  VoucherReferral: VoucherReferral[];
  Event: Event[];
  Point?: Point[];
  Order: Order[];
  Review: Review[];
};
