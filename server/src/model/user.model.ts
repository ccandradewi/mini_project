import {
  Event,
  Gender,
  Order,
  Review,
  Role,
  VoucherPoint,
} from "@prisma/client";

export type TUser = {
<<<<<<< HEAD
  id: string;
  email: string;
  password?: string;
  role: Role;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string | null;
  gender: Gender | null;
  dob: Date | null;
  avatar?: string | null;
  referral_code?: string | null;
  reference_code?: string | null;
  createdAt?: Date;
  updatedAt?: Date;

} | null;
=======
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
};
>>>>>>> main
