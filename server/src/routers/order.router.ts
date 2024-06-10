import { Response, Request, NextFunction, Router } from "express";
// import orderController from "../controllers/order.controller";
import { verifyUser } from "../middlewares/auth.middleware";
import orderController from "../controllers/order.controller";

class OrderRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }

  initializedRoutes() {
    this.router.get("/", orderController.getAll);
    this.router.get("/:orderId", orderController.getOrderByOrderId);
    this.router.get("/seller/:sellerId", orderController.getOrderBySellerId);
    this.router.get("/buyer/:buyerId", orderController.getOrderByBuyerId);
    this.router.get("/event/:eventId", orderController.getOrderByEventId);
    this.router.get(
      "/seller/:sellerId/status/:status",
      orderController.getOrderBySellerIdAndStatus
    );
    this.router.get(
      "/event/:eventId/status/:status",
      orderController.getOrderByEventIdAndStatus
    );
    this.router.get("/vp/:buyerId", orderController.getVoucherPoint);
    this.router.delete("/:orderId", orderController.deleteOrder);
    this.router.post("/", orderController.createOrder);

    // this.router.post("/v1", orderController.createOrder);
  }

  getRouter() {
    return this.router;
  }
}

export default new OrderRouter();
