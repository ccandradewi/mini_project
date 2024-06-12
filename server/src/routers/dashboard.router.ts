import { Router } from "express";
import dashboardController from "../controllers/dashboard.controller";
import { verifyUser } from "../middlewares/auth.middleware";
import { verifySeller } from "../middlewares/role.middleware";

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
  }

  getRouter() {
    return this.router;
  }
}

export default new DashboardRouter();
