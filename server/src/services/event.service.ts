import { Request } from "express";
import { prisma } from "../libs/prisma";
import { CategoryName, LocationName, Prisma, Promo } from "@prisma/client";
import { TEvent } from "../model/event.model";
import sharp from "sharp";

class EventService {
  async getAll(req: Request) {
    const data = await prisma.event.findMany({
      select: {
        id: true,
        banner: true,
        title: true,
        city: true,
        start_time: true,
        end_time: true,
        ticket_price: true,
        discount_price: true,
        promotor: true,
        promo: true,
        venue: true,
      },
    });
    return data;
  }

  async getEventByTitle(req: Request) {
    const { title } = req.query;
    if (!title || typeof title !== "string") {
      console.error("Invalid search query parameter:", title);
      throw new Error("invalid search");
    }
    console.log("Searching for events with title containing:", title);
    const data = await prisma.event.findMany({
      where: {
        title: { contains: title },
      },
      select: {
        title: true,
        city: true,
        start_time: true,
        ticket_price: true,
        location: true,
        category: true,
        banner: true,
        promotor: true,
      },
    });
    if (!data || data.length === 0) {
      throw new Error("Event Not Found");
    }
    console.log("Found events:", data);
    return data;
  }
  async getBySeller(req: Request) {
    const data = await prisma.event.findMany({
      where: {
        user_id: req.user?.id,
      },
      select: {
        id: true,
        banner: true,
        title: true,
        description: true,
        city: true,
        category: true,
        start_time: true,
        end_time: true,
        ticket_price: true,
        availability: true,
        promo: true,
        start_promo: true,
        end_promo: true,
        createdAt: true,
        updatedAt: true,
        venue: true,
        discount_price: true,
      },
    });
    return data;
  }
  async getByfilter(req: Request) {
    const { city, category } = req.query;
    let filter: any = {};

    if (city && typeof city === "string") {
      filter.city = city;
    }
    if (category && typeof category === "string") {
      filter.category = category;
    }

    const data = await prisma.event.findMany({
      where: filter,
      select: {
        id: true,
        title: true,
        start_time: true,
        ticket_price: true,
        discount_price: true,
        location: true,
        category: true,
        banner: true,
        venue: true,
        city: true,
        promotor: true,
      },
    });

    return data;
  }
  async getDetailEvent(req: Request) {
    const { eventId } = req.params;
    const data = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
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
        ticket_price: true,
        promo: true,
        discount_price: true,
        start_promo: true,
        end_promo: true,
        availability: true,
      },
    });
    return data;
  }
  async createEvent(req: Request): Promise<TEvent> {
    const { userId } = req.params;
    const { file } = req;

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
      ticket_price,
      availability,
      promo,
      start_promo,
      end_promo,
    } = req.body as TEvent;

    if (!file) throw new Error("No file uploaded");
    const buffer = await sharp(req.file?.buffer).png().toBuffer();
    const existingEvent = await prisma.event.findFirst({
      where: { title },
    });
    if (existingEvent)
      throw new Error(
        "There is event with the same title. Please choose different title"
      );
    if (promo && (!start_promo || !end_promo)) {
      throw new Error("Please enter the duration of the promo");
    } else if (
      promo &&
      end_promo &&
      new Date(end_promo) > new Date(start_time)
    ) {
      throw new Error("Set end time of the promo before the event starts");
    } else if (end_promo && new Date(end_promo) > new Date(start_time)) {
      throw new Error("End time of the promo cannot be after the event starts");
    }
    const promoDiscounts: { [key in Promo]: number } = {
      TEN_PERCENT: 0.1,
      TWENTY_FIVE_PERCENT: 0.25,
      FIFTY_PERCENT: 0.5,
    };
    let ticketPrice;
    let discountPrice;
    if (type === "FREE") {
      ticketPrice = 0;
    } else if (type === "PAID") {
      ticketPrice = Number(ticket_price);
    }

    if (type === "PAID" && promo) {
      const discount = promoDiscounts[promo as keyof typeof promoDiscounts];
      discountPrice = ticket_price
        ? ticket_price - ticket_price * discount
        : null;
    }
    const createEvent = await prisma.event.create({
      data: {
        user: { connect: { id: req.user?.id } },
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
        availability: Number(availability),
        ticket_price: ticketPrice,
        discount_price: discountPrice,
        promo,
        start_promo: start_promo
          ? new Date(start_promo).toISOString()
          : undefined,
        end_promo: end_promo ? new Date(end_promo) : undefined,
      },
    });
    console.log(createEvent);
    console.log(req);
    console.log("test");

    return createEvent;
  }

  async updateEvent(req: Request) {
    const { eventId } = req.params;
    const { file } = req;
    const userId = req.user?.id;

    const currentEvent = await prisma.event.findUnique({
      where: { id: eventId, user_id: userId },
      select: { ticket_price: true, type: true },
    });

    if (!currentEvent) {
      throw new Error("Event not found");
    }

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
      type = currentEvent.type,
      ticket_price = currentEvent.ticket_price,
      availability,
      promo,
      start_promo,
      end_promo,
    } = req.body as TEvent;

    const promoDiscounts: { [key in Promo]: number } = {
      TEN_PERCENT: 0.1,
      TWENTY_FIVE_PERCENT: 0.25,
      FIFTY_PERCENT: 0.5,
    };

    let ticketPrice;
    let discountPrice;

    if (type === "FREE") {
      ticketPrice = 0;
    } else if (type === "PAID") {
      ticketPrice = Number(ticket_price);
    }

    if (type === "PAID" && promo) {
      const discount = promoDiscounts[promo as keyof typeof promoDiscounts];
      discountPrice = ticket_price
        ? ticket_price - ticket_price * discount
        : null;
    }

    const data: Prisma.EventUpdateInput = {
      title,
      description,
      start_time: start_time ? new Date(start_time).toISOString() : undefined,
      end_time: end_time ? new Date(end_time) : undefined,
      venue,
      city,
      location,
      category,
      promotor,
      type,
      availability: availability ? Number(availability) : undefined,
      ticket_price: ticketPrice,
      discount_price: discountPrice,
      promo,
      start_promo: start_promo
        ? new Date(start_promo).toISOString()
        : undefined,
      end_promo: end_promo ? new Date(end_promo) : undefined,
    };

    if (file) {
      const buffer = await sharp(req.file?.buffer).png().toBuffer();
      data.banner = buffer;
    }

    return await prisma.event.update({
      data,
      where: { id: eventId, user_id: userId },
    });
  }

  async renderBanner(req: Request) {
    const data = await prisma.event.findUnique({
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
