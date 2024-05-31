import {
  Event,
  Gender,
  Order,
  Review,
  Role,
  VoucherPoint,
} from "@prisma/client";

export type TUser = {
  id: string;
  email: string;
  password?: string;
  role: Role;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  isVerified?: boolean | null;
  address: string | null;
  gender: Gender | null;
  dob: Date | null;
  avatar?: string | null;
  referral_code?: string | null;
  reference_code?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
} | null;
