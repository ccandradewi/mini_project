import { Request } from "express";
import { prisma } from "../libs/prisma";
import { CategoryName, LocationName, Prisma } from "@prisma/client";
import { TEvent } from "../model/event.model";
import sharp from "sharp";

class EventService {
  async getAll(req: Request) {
    const data = await prisma.event.findMany();
    return data;
  }

  async getEventByTitle(req: Request) {
    const { title } = req.query;
    if (!title || typeof title != "string") {
      throw new Error("invalid search");
    }
    const data = await prisma.event.findFirst({
      where: {
        title: { contains: title },
      },
      select: {
        title: true,
        start_time: true,
        ticket: true,
        location: true,
        category: true,
        banner: true,
        promotor: true,
      },
    });
    if (!data) throw new Error("Event Not Found");
    return data;
  }
  async getByfilter(req: Request) {
    const { city, category } = req.query;
    let filter: any = {};
    if (city) {
      filter.city = city as LocationName;
    }
    if (location) {
      filter.category = category as CategoryName;
    }
    const data = await prisma.event.findMany({
      where: filter,
      select: {
        title: true,
        start_time: true,
        ticket: true,
        location: true,
        category: true,
        banner: true,
        promotor: true,
      },
    });
    if (!data) throw new Error("Event Not Found");
    return data;
  }
  async getDetailEvent(req: Request) {
    const { eventId } = req.params;
    const data = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        banner: true,
        title: true,
        description: true,
        start_time: true,
        end_time: true,
        venue: true,
        city: true,
        location: true,
        category: true,
        promotor: true,
        type: true,
      },
    });
    return data;
  }
  async createEvent(req: Request): Promise<TEvent> {
    const { userId } = req.params;
    const { file } = req;
    const buffer = await sharp(req.file?.buffer).png().toBuffer();
    if (!file) throw new Error("No file uploaded");
    const {
      title,
      description,
      start_time,
      end_time,
      venue,
      city,
      location,
      category,
      promotor,
      type,
      promo,
      start_promo,
      end_promo,
    } = req.body as TEvent;
    const existingEvent = await prisma.event.findFirst({
      where: { title },
    });
    if (existingEvent)
      throw new Error(
        "There is event with the same title. Please choose different title"
      );
    if (promo && (!start_promo || !end_promo)) {
      throw new Error("plese enter the duration of the promo");
    }
    const getUser = (await prisma.user.findFirst({
      where: { id: userId },
      select: { id: true },
    })) as { id: string };
    const createEvent = prisma.event.create({
      data: {
        user_id: getUser.id,
        banner: buffer,
        title,
        description,
        start_time: new Date(start_time).toISOString(),
        end_time: new Date(end_time),
        venue,
        city,
        location,
        category,
        promotor,
        type,
        promo,
        start_promo,
        end_promo,
      },
    });
    return createEvent;
  }
  async renderBanner(req: Request) {
    const data = await prisma.event.findFirst({
      where: {
        id: req.params.id,
      },
    });
    return data?.banner;
  }
  async deleteEvent(req: Request) {
    const { eventId } = req.params;
    return await prisma.event.delete({
      where: { id: eventId },
    });
  }
}

export default new EventService();
