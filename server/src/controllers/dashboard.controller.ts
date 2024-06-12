import { NextFunction, Request, Response } from "express";
import dashboardService from "../services/dashboard.service";

class DashboardController {
  async getSellerDashboardMetric(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await dashboardService.getSellerDashboardMetric(req);
      return res.send({
        message: "fetching seller dashboard dataa",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
