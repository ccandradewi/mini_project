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

    // VOUCHER POINT SECTION

    // check if new user inputs ref code, check if ref code exists
    if (reference_code) {
      const referrer = await prisma.user.findFirst({
        where: {
          referral_code: data.reference_code,
        },
      });
      console.log("referrer found", referrer);

      // add new user using referrer's ref code
      const newUser = await prisma.user.create({
        data,
      });
      console.log("new user created with reference", newUser);

      if (referrer) {
        try {
          // check if referrer already exists in voucher point (their referral is used)
          const referrerPoint = await prisma.voucherPoint.findFirst({
            where: {
              user_id: referrer.id,
            },
          });

          // add 10000 to last point amount
          const newPoint = (referrerPoint?.point || 0) + 10000;

          if (referrerPoint) {
            // update referrer's point in voucherpoint
            await prisma.voucherPoint.update({
              where: { id: referrerPoint.id },
              data: {
                point: newPoint,
                expired_date: newUser.createdAt,
                voucher: referrerPoint.voucher,
                isValid: false,
              },
            });
          } else {
            // if referral code's never been used, it will create new data in voucherpoint
            await prisma.voucherPoint.create({
              data: {
                user_id: referrer.id,
                point: newPoint,
                expired_date: newUser.createdAt,
                voucher: 0,
                isValid: false,
              },
            });
          }
          console.log("point added for referrer");
        } catch (error) {
          console.log("error adding point for referrer");
        }
      }

      // add new user voucher in voucherpoint
      const newVoucherPoint = await prisma.voucherPoint.create({
        data: {
          user_id: newUser.id,
          point: 0,
          expired_date: new Date(0),
          voucher: 0.1,
          isValid: true,
        },
      });
      console.log("point added to new user", newVoucherPoint);
    } else {
      // if new user doesnt use any ref code
      await prisma.user.create({
        data,
      });
      console.log("user added, no ref code");
    }
  }
}

export default new UserService();
