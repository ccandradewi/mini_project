import { NextFunction, Request, Response } from "express";
import userService from "../services/user.service";
class UserController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.userRegister(req);
      res.status(201).send({
        message: "new user has been register",
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new UserController();
