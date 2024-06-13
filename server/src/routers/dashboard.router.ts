import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller";
import { verifyUser } from "../middlewares/auth.middleware";
import { verifySeller } from "../middlewares/role.middleware";
import eventController from "../controllers/event.controller";

class DashboardRouter {
  private router: Router;
  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }

  initializedRoutes() {
    this.router.get(
      "/metric",
      verifyUser,
      verifySeller,
      dashboardController.getSellerDashboardMetric
    );
    this.router.post("/addReview", dashboardController.addReview);
    this.router.get(
      "/getReviewByEventId/:eventId",
      dashboardController.getReviewByEventId
    );
    this.router.get(
      "/getReviewByUserId/:userId",
      dashboardController.getReviewByUserId
    );
  }

  getRouter() {
    return this.router;
  }
}

export default new DashboardRouter();
