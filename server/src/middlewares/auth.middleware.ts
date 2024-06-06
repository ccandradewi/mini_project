import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";
import { TUser, TDecode } from "../model/user.model";
export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "") || "";
    req.user = verify(token, SECRET_KEY) as TUser;
    console.log("decoded token", req.user);

    next();
  } catch (error) {
    console.log("jwt error");
    next(error);
  }
};

export const validateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    console.log("received token", token);

    const decode = verify(token!, SECRET_KEY) as TDecode;
    if (decode.type != "accessToken") throw new Error("invalid token");
    req.user = decode.user;
    console.log("decoded token", req.user);

    next();
  } catch (error) {
    console.log("validation error");

    next(error);
  }
};
