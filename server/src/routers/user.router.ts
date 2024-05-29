import { Response, Request, NextFunction, Router } from "express";
import userController from "../controllers/user.controller";
import { verifyUser } from "../middlewares/auth.middleware";
import { blobUploader } from "../libs/multer";

class UserRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }

  initializedRoutes() {
    this.router.post("/v1", userController.register);
    this.router.post("/v2", userController.login);
    this.router.get("/v3:token", userController.sendVerif);
    this.router.get("image/:id", userController.renderAvatar);
    this.router.patch(
      "/:id",

      blobUploader().single("image"),
      userController.update
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new UserRouter();
