import { type NextFunction, Request, type Response } from "express";
import { TUser } from "../model/user.model";
import { verify } from "jsonwebtoken";
import { SECRET_KEY } from "../config/config";


export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "") || "";
    const verifiedUser = verify(token, SECRET_KEY);

    req.user = verifiedUser as TUser;

    next();

    // const decoded = verify(token, SECRET_KEY) as TUser;
    // req.user = decoded;


  } catch (error) {
    next(error);
  }
};
