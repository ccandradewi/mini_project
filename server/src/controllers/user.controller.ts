import { type Request, type NextFunction, type Response } from "express";
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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken, refreshToken, role } = await userService.userLogin(
        req
      );


      if (role && role === "seller") {
        res
          .cookie("access_token", accessToken, { httpOnly: true })
          .cookie("refresh_token", refreshToken, { httpOnly: true })
          .send({
            message: "Login as seller",
            role: "seller",
            url: "/dashboard",
          });
      } else if (role && role === "buyer") {
        res
          .cookie("access_token", accessToken)
          .cookie("refresh_token", refreshToken)
          .send({
            message: "Login as buyer",
            role: "buyer",
            url: "/",
          });
      } else {
        res.status(400).send("Role is invalid");
      }
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.userLogout(req);

      res
        .clearCookie("access_token", { httpOnly: true })
        .clearCookie("refresh_token", { httpOnly: true })
        .status(200)
        .send({
          message: "Successfully logged out",
        });
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await userService.getUserById(req);
      res.send({
        message: "fetching by ID",
        data
      })
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req:Request, res:Response, next:NextFunction) {
    try {
      const user = await userService.getCurrentUser(req);

      if (!user) {
        return res.status(404).send({mesage: "User not found"})
      }

      res.json({user});
    } catch (error) {
      next(error)
    }
  }
  // async getCurrentUser(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const token =
  //       req.cookies["access_token"] ||
  //       req.headers.authorization?.replace("Bearer ", "");

  //     if (!token) {
  //       return res.status(401).send("Access denied. No token provided.");
  //     }

  //     const user = await userService.getCurrentUser(token);
  //     res.status(200).send({ user });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default new UserController();
