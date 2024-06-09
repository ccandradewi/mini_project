import { Response, Request, NextFunction, Router } from "express";
// import orderController from "../controllers/order.controller";
import { verifyUser } from "../middlewares/auth.middleware";

class OrderRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }

  initializedRoutes() {
    // this.router.post("/v1", orderController.createOrder);
  }

  getRouter() {
    return this.router;
  }
}

export default new OrderRouter();
