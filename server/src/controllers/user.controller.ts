import { type NextFunction, type Response, type Request } from "express";
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
  async sendVerif(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.sendVerification(req);
      res.redirect("http://localhost:3000/users/v2");
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.editUser(req);
      res.status(201).send({ message: "Success update your profile" });
    } catch (error) {
      next(error);
    }
  }
  async renderAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const blob = await userService.render(req);
      res.set("Content-type", "image/png");
      res.send(blob);
    } catch (error) {
      next(error);
    }
  }
}
export default new UserController();
