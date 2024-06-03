import { NextFunction, Request, Response } from "express";
import eventService from "../services/event.service";

class EventCotroller {
  async getAllEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await eventService.getAll(req);
      return res.send({
        message: "All Event",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getEventDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await eventService.getDetailEvent(req);
      return res.send({
        message: "Event Detail",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getEventTitle(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await eventService.getEventByTitle(req);
      return res.send({
        message: "Event by title",
        data,
      });
    } catch (error) {
      console.error("Error getting event by title:", error);
      next(error);
    }
  }
  async getBySeller(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await eventService.getBySeller(req);
      return res.send({
        message: "All event that has been created",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async filterEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await eventService.getByfilter(req);
      return res.send({
        message: "filtering event",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await eventService.createEvent(req);
      return res.send({
        message: "New Event has been created",
      });
    } catch (error) {
      next(error);
    }
  }
  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      await eventService.updateEvent(req);
      return res.send({
        message: "event has been updated",
      });
    } catch (error) {
      next(error);
    }
  }
  async renderBanner(req: Request, res: Response, next: NextFunction) {
    try {
      const blob = await eventService.getDetailEvent(req);
      return res.set("Content-type", "image/png");
      res.send(blob);
    } catch (error) {
      next(error);
    }
  }
  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await eventService.deleteEvent(req);
      return res.send({
        message: "An Event has been deleted",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EventCotroller();
