import type { Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";
import { comparePassword, hashPassword } from "../libs/bcrypt";
import type { TUser } from "../model/user.model";
import { Request } from "express";
import { createToken } from "../libs/jwt";
import ReferralCode from "../libs/referral";

class UserService {
  async userLogin(req: Request) {
    const { email, password } = req.body;

    const where: Prisma.UserWhereUniqueInput = {
      email: email,
    };

    const select: Prisma.UserSelectScalar = {
      id: true,
      username: true,
      email: true,
      first_name: true,
      last_name: true,
      phone_number: true,
      address: true,
      gender: true,
      dob: true,
      avatar: true,
      reference_code: true,
      referral_code: true,
      password: true,
      role: true,
    };

    const data: TUser = await prisma.user.findFirst({
      select,
      where,
    });

    console.log(data?.username);

    if (!data?.password) throw new Error("Wrong e-mail or username!");
    const checkUser = await comparePassword(data.password, password);
    if (!checkUser) throw new Error("Wrong password!");

    delete data.password;

    const accessToken = createToken(data, "1hr");
    const refreshToken = createToken({ id: data.id }, "24hr");
    return { accessToken, refreshToken, role: data.role };
  }

  async userRegister(req: Request) {
    const {
      email,
      password,
      username,
      role,
      first_name,
      last_name,
      phone_number,
      reference_code,
    } = req.body;

    const existingUser = await prisma.user.findMany({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (existingUser.length) throw new Error("username/email already used");

    const hashPass = await hashPassword(password);

    const referralCode = ReferralCode.generateCode();

    const data: Prisma.UserCreateInput = {
      email,
      password: hashPass,
      username,
      role,
      first_name,
      last_name,
      phone_number,
      reference_code,
      referral_code: referralCode[0],
    };
    await prisma.user.create({
      data,
    });
  }
}

export default new UserService();
