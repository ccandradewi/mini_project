import type { Prisma } from "@prisma/client";
import { prisma } from "../libs/prisma";
import { comparePassword, hashPassword } from "../libs/bcrypt";
import type { TUser } from "../model/user.model";
import { Request } from "express";
import { createToken } from "../libs/jwt";
import ReferralCode from "../libs/referral";
import { transporter } from "../libs/nodemailer";
import { SECRET_KEY } from "../config/config";
import { verify } from "jsonwebtoken";
import fs, { readFile } from "fs";
import { join } from "path";
import { render } from "mustache";
import { create } from "domain";

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

    const accessToken = createToken(data, "15m");
    const refreshToken = createToken({ id: data.id }, "1hr");
    return {
      accessToken,
      refreshToken,
      role: data.role,
      referral_code: data.referral_code,
    };
  }

  async userByUserId(req: Request) {
    const data = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: {
        id: true,
        email: true,
        password: true,
        username: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        referral_code: true,
      },
    });
    return data;
  }

  async sendingEmail(
    userId: string,
    userEmail: string,
    userFirstName: string,
    pathToEmailTemplate: string,
    emailSubject: string,
    verify_url: string
  ) {
    const verifyToken = createToken({ id: userId }, "30m");

    const template = fs
      .readFileSync(__dirname + pathToEmailTemplate)
      .toString();

    const html = render(template, {
      email: userEmail,
      first_name: userFirstName,
      verify_url: `http://localhost:3000/${verify_url}/${verifyToken}`,
    });
    let returnFromTransporter = await transporter
      .sendMail({
        to: userEmail,
        subject: emailSubject,
        html,
      })
      .then((info) => "Email sent successfully")
      .catch((error) => error.message);
    return returnFromTransporter;
  }

  async userRegister(req: Request) {
    console.log("masuk di function ini");
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
    if (existingUser.length)
      throw new Error("Username/email has already been used");

    const hashPass = await hashPassword(password);

    // const referralCode = ReferralCode.generateCode();
    let referralCode;
    if (role !== "seller") {
      referralCode = ReferralCode.generateCode();
    }
    const data: Prisma.UserCreateInput = {
      email,
      password: hashPass,
      username,
      role,
      first_name,
      last_name,
      phone_number,
      referral_code: referralCode ? referralCode[0] : null,
    };

    let newUser;

    // VOUCHER POINT SECTION

    // check if new user inputs ref code, check if ref code exists
    if (reference_code) {
      const referrer = await prisma.user.findFirst({
        where: {
          referral_code: reference_code,
        },
      });
      console.log("referrer found", referrer);

      console.log("new user created with reference", newUser);

      if (!referrer) throw new Error("Invalid referral code");

      // check if referrer already exists in voucher point (their referral is used)
      const referrerPoint = await prisma.voucherPoint.findFirst({
        where: {
          user_id: referrer.id,
        },
      });

      // add 10000 to last point amount
      const newPoint =
        referrerPoint?.expired_date! > new Date()
          ? (referrerPoint?.point || 0) + 10000
          : 10000;

      const expirationDate = new Date();
      expirationDate.setMonth(expirationDate.getMonth() + 3);

      if (referrerPoint) {
        // update referrer's point in voucherpoint
        await prisma.voucherPoint.update({
          where: { id: referrerPoint.id },
          data: {
            point: newPoint,
            expired_date: expirationDate,
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
            expired_date: expirationDate,
            voucher: 0,
            isValid: false,
          },
        });
      }

      data.reference_code = reference_code;
      console.log("point added for referrer");
    }
    // add new user using referrer's ref code
    newUser = await prisma.user.create({
      data,
    });

    // add new user voucher in voucherpoint
    if (reference_code)
      await prisma.voucherPoint.create({
        data: {
          user_id: newUser.id,
          point: 0,
          expired_date: new Date(0),
          voucher: 0.1,
          isValid: true,
        },
      });

    let sentEmail = this.sendingEmail(
      newUser.id,
      data.email,
      data.first_name,
      "/../templates/verification.html",
      "Welcome To Tickzy, Please Verify Your Email Address",
      "verify"
    );
    return `New user has been registered to our database, and ${sentEmail}`;
  }

  async sendVerification(req: Request) {
    try {
      const { token } = req.params;
      const user = verify(token, SECRET_KEY) as TUser;

      if (!user || !user.id) {
        throw new Error("Invalid token/user");
      }

      await prisma.user.update({
        where: {
          id: user?.id,
        },
        data: {
          isVerified: true,
        },
      });

      return { success: true };
    } catch (error) {
      console.log("Error sending verification");
    }
  }

  async validate(req: Request) {
    const select: Prisma.UserSelectScalar = {
      id: true,
      username: true,
      email: true,
      first_name: true,
      last_name: true,
      avatar: true,
      isVerified: true,
      phone_number: true,
      role: true,
    };

    const data = await prisma.user.findUnique({
      select,
      where: {
        id: req.user?.id,
      },
    });

    const access_token = createToken(data, "1hr");

    return { access_token, isVerified: data?.isVerified };
  }
  async resendVerification(req: Request) {
    try {
      const { email } = req.body;
      const select: Prisma.UserSelectScalar = {
        id: true,
        first_name: true,
        isVerified: true,
      };
      const data = await prisma.user.findUnique({
        select,
        where: { email: email },
      });
      if (data) {
        if (data.isVerified) {
          return "You have previously verified your email";
        } else {
          let message = await this.sendingEmail(
            data.id,
            email,
            data.first_name,
            "/../templates/verification.html",
            "Welcome To Tickzy, Please Verify Your Email Address",
            "verify"
          );
          return message;
        }
      }
    } catch (error) {
      console.log("error resend email");
    }
  }
  async sendChangePasswordLink(req: Request) {
    const { email } = req.body;
    const select: Prisma.UserSelectScalar = {
      id: true,
      first_name: true,
    };
    const data = await prisma.user.findUnique({
      select,
      where: {
        email: email,
      },
    });
    if (data === null) {
      return false;
    } else {
      let sendEmailResult = await this.sendingEmail(
        data.id,
        email,
        data.first_name,
        "/../templates/resetpassword.html",
        "We received request to change your password on Tickzy",
        "changePassword"
      );
      return sendEmailResult;
    }
  }
  async verifyChangePass(req: Request) {
    try {
      const { token, newPassword } = req.body;
      const user = verify(token, SECRET_KEY) as TUser;
      if (!user || !user.id) {
        throw new Error("invalid token");
      }
      const hashPass = await hashPassword(newPassword);
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hashPass,
        },
      });
      return "Password changed succesfully!";
    } catch (error) {
      return "Failed to change password drom our API";
    }
  }
}

export default new UserService();
