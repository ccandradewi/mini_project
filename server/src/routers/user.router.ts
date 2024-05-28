import { Response, Request, NextFunction, Router } from "express";
import userController from "../controllers/user.controller";

class UserRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }

  initializedRoutes() {
    this.router.post("/v1", userController.register);
    this.router.post("/v2", userController.login);
    this.router.get("/verification/:token", userController.sendVerif);
  }

  getRouter() {
    return this.router;
  }
}

export default new UserRouter();
