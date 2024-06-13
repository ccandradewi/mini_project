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
  async addReview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getReviewByEventId(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getReviewByEventId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getReviewByEventId(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getReviewByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await dashboardService.getReviewByUserId(req);
      return res.send({
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DashboardController();
