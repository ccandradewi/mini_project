import { Request } from "express";
import { prisma } from "../libs/prisma";
import { hashPassword } from "../libs/bcrypt";
import { Prisma } from "@prisma/client";
import { generateReferral } from "../libs/referral";

class UserService {
  async userRegister(req: Request) {
    const {
      email,
      password,
      username,
      role,
      first_name,
      last_name,
      phone_number,
      address,
      gender,
      dob,
      avatar,
      referral_code,
      reference_code,
    } = req.body;
    const existingUser = await prisma.user.findMany({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser.length) throw new Error("username/email already used");
    const hashPass = await hashPassword(password);
    const [referral_code] = generateReferral({ length: 8 });
    const data: Prisma.UserCreateInput = {
      email,
      password: hashPass,
      username,
      role,
      gender,
      first_name,
      last_name,
      phone_number,
      address,
      dob,
      avatar,
      referral_code: generateRef,
      reference_code,
    };
    await prisma.user.create({
      data,
    });
  }
}

export default new UserService();
