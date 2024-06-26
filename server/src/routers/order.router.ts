import { Response, Request, NextFunction, Router } from "express";
// import orderController from "../controllers/order.controller";
import { verifyUser } from "../middlewares/auth.middleware";
import orderController from "../controllers/order.controller";
import { verifyBuyer, verifySeller } from "../middlewares/role.middleware";
import { blobUploader } from "../libs/multer";

class OrderRouter {
  private router: Router;

  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }

  initializedRoutes() {
    this.router.get("/", orderController.getAll);
    this.router.get("/:orderId", orderController.getOrderByOrderId);
    this.router.patch(
      "/:orderId",
      blobUploader().single("payment_proof"),
      orderController.updateOrder
    );
    this.router.get(
      "/seller/myOrder",
      verifyUser,
      verifySeller,
      orderController.getOrderBySellerId
    );
    this.router.get(
      "/buyer/myTicket",
      verifyUser,
      verifyBuyer,
      orderController.getOrderByBuyerId
    );
    this.router.get("/event/:eventId", orderController.getOrderByEventId);
    this.router.get(
      "/seller/:sellerId/status/:status",
      orderController.getOrderBySellerIdAndStatus
    );
    this.router.get(
      "/event/:eventId/status/:status",
      orderController.getOrderByEventIdAndStatus
    );
    this.router.get("/ticket/:orderId", orderController.getTicket);
    this.router.get("/vp/:buyerId", orderController.getVoucherPoint);
    this.router.delete("/:orderId", orderController.deleteOrder);
    this.router.post("/", verifyUser, verifyBuyer, orderController.createOrder);
    this.router.get("/inv", orderController.getOrderId);
    // this.router.get(
    //   "/dashboard/s",
    //   verifyUser,
    //   verifySeller,
    //   orderController.getSellerDashboardData
    // );

    // this.router.post("/v1", orderController.createOrder);
  }

  getRouter() {
    return this.router;
  }
}

export default new OrderRouter();
