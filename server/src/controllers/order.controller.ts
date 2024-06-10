import { NextFunction, Request, Response } from "express";
import orderService from "../services/order.service";

class OrderController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await orderService.getAll(req);
      return res.send({
        message: "fetch all orders",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderBySellerId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await orderService.getOrderBySellerId(req);
      return res.send({
        message: "fetch all orders by certain seller",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await orderService.getOrderByOrderId(req);
      return res.send({
        message: "fetch order detail",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderByEventId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await orderService.getOrderByEventId(req);
      return res.send({
        message: "fetch order by event id",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderByBuyerId(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await orderService.getOrderByBuyerId(req);
      return res.send({
        message: "fetch order detail of 1 buyer",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderBySellerIdAndStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await orderService.getOrderBySellerIdAndStatus(req);
      return res.send({
        message: "fetching all orders from 1 seller by order status",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOrderByEventIdAndStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = await orderService.getOrderByEventIdAndStatus(req);
      return res.send({
        message: "fetching all orders from 1 event by order status",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getVoucherPoint(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await orderService.getVoucherPoint(req);
      return res.send({
        message: "fetch voucher and point data of 1 buyer",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const deleted_data = await orderService.deleteOrder(req);
      return res.send({
        message: "order has successfully been deleted",
        deleted_data,
      });
    } catch (error) {
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await orderService.createOrder(req);
      return res.send({
        message: "a buyer successfully made an order",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
