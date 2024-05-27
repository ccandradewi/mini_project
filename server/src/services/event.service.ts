import { Request } from "express";
import { prisma } from "../libs/prisma";
import { Prisma } from "@prisma/client";

class EventService {
  async getAll(req: Request) {
    const data = await prisma.event.findMany();
  }
  async getEventByTitle(req: Request) {
    const { title } = req.params;
    const data = await prisma.event.findFirst({
      where: {
        title: title,
      },
      include: {
        user: true,
        location: true,
        category: true,
        Ticket: true,
      },
    });
    if (!data) throw new Error("Event Not Found");
  }
  async createEvent(req: Request) {
    const {
      userId,
      banner,
      title,
      description,
      start_time,
      end_time,
      venue,
      location_id,
      category_id,
      promotor,
      //   promo,
    } = req.body;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");
    if (user.role !== "seller")
      throw new Error("Only users with the seller role can create events");
    const data: Prisma.EventCreateInput = {
      user: {
        connect: {
          id: userId,
        },
      },
      banner,
      title,
      description,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      venue,
      location: {
        connect: {
          id: location_id,
        },
      },
      category: {
        connect: {
          id: category_id,
        },
      },
      promotor,
      //  promo,
    };

    return await prisma.event.create({
      data,
    });
  }
}
