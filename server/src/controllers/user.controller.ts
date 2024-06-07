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
          .cookie("access_token", accessToken)
          .cookie("refresh_token", refreshToken)
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
      res.send({ message: "verification success" });
    } catch (error) {
      next(error);
    }
  }
  async sendChangePassword(req: Request, res: Response, next: NextFunction) {
    try {
      let result = await userService.sendChangePasswordLink(req);
      if (result) {
        res.status(200).send({ message: result });
      } else {
        res.status(400).send({
          message:
            "Your email is not registered in our database, please do register first.",
        });
      }
    } catch (error) {
      next(error);
    }
  }
  async verifyChangePass(req: Request, res: Response, next: NextFunction) {
    try {
      let result = await userService.verifyChangePass(req);
      res.status(200).send({ message: result });
    } catch (error) {
      next(error);
    }
  }
  async resendEmail(req: Request, res: Response, next: NextFunction) {
    try {
      let response = await userService.resendVerification(req);
      res.status(201).send({
        message: response,
      });
    } catch (error) {
      next(error);
    }
  }

  async validateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { access_token, isVerified } = await userService.validate(req);

      res.send({
        message: "success",
        isVerified,
        access_token,
      });
    } catch (error) {
      next(error);
    }
  }
}
export default new UserController();
