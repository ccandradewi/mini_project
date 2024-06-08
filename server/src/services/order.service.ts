import { Request } from "express";
import { prisma } from "../libs/prisma";
import { StatusOrder } from "@prisma/client";
import { TEvent } from "../model/event.model";
import sharp from "sharp";

class OrderService {
  async getAll(req: Request) {
    try {
      const orders = await prisma.order.findMany();
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error}`);
    }
  }

  async getOrderByOrderId(req: Request) {
    const { orderId } = req.params;
    const data = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        buyer_id: true,
        event_id: true,
        total_ticket: true,
        total_price: true,
        date: true,
        payment_date: true,
        payment_method: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return data;
  }

  async getOrderByBuyerId(req: Request) {
    const { buyerId } = req.params;
    const data = await prisma.order.findMany({
      where: { buyer_id: buyerId },
      select: {
        id: true,
        buyer_id: true,
        event_id: true,
        total_ticket: true,
        total_price: true,
        date: true,
        payment_date: true,
        payment_method: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return data;
  }

  async getOrderByEventId(req: Request) {
    const { eventId } = req.params;
    const data = await prisma.order.findMany({
      where: { event_id: eventId },
      select: {
        id: true,
        buyer_id: true,
        event_id: true,
        total_ticket: true,
        total_price: true,
        date: true,
        payment_date: true,
        payment_method: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return data;
  }

  async getOrderBySellerId(req: Request) {
    const { sellerId } = req.params;
    const data = await prisma.order.findMany({
      where: {
        event: {
          user_id: sellerId,
        },
      },
    });
    return data;
  }

  async getOrderBySellerIdAndStatus(req: Request) {
    const { sellerId, status } = req.params;
    const data = await prisma.order.findMany({
      where: {
        event: {
          user_id: sellerId,
        },
        status: status as StatusOrder,
      },
      select: {
        id: true,
        buyer_id: true,
        event_id: true,
        total_ticket: true,
        total_price: true,
        date: true,
        payment_date: true,
        payment_method: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        event: {
          select: {
            user_id: true,
            title: true,
          },
        },
      },
    });
    return data;
  }

  async getOrderByEventIdAndStatus(req: Request) {
    const { eventId, status } = req.params;
    const data = await prisma.order.findMany({
      where: {
        event_id: eventId,
        status: status as StatusOrder,
      },
      select: {
        id: true,
        buyer_id: true,
        event_id: true,
        total_ticket: true,
        total_price: true,
        date: true,
        payment_date: true,
        payment_method: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return data;
  }

  async createOrder(req: Request) {
    const {
      buyer_id,
      event_id,
      total_ticket,
      payment_method,
      payment_date,
      payment_proof,
      status = StatusOrder.pending,
    } = req.body;

    // cek input field
    if (!buyer_id || !event_id || !total_ticket || !payment_method) {
      throw new Error("Missing required fields");
    }

    // ticket dr req body string, convert ke integer
    const parsedTotalTicket = parseInt(total_ticket, 10);

    // validate jmlh tiket, min 1, max 3
    if (parsedTotalTicket < 1) {
      throw new Error("Pick at least one ticket");
    } else if (parsedTotalTicket > 3) {
      throw new Error("Maximum of 3 tickets per order is allowed");
    }

    // cari event, utk validasi
    const event = await prisma.event.findUnique({ where: { id: event_id } });

    if (!event) {
      throw new Error("Invalid event");
    }

    if (event.end_time < new Date()) {
      throw new Error("Event has already ended");
    }

    if (event.start_time < new Date()) {
      throw new Error("Event has already started");
    }

    if (event.availability < parsedTotalTicket) {
      throw new Error("Not enough available tickets");
    }

    // hitung total harga berdasarkan jenis acara dan promo ada/gak/tglnya
    let total_price: number;

    if (event.type === "FREE") {
      total_price = 0;
    } else if (event.promo && event.end_promo && new Date() < event.end_promo) {
      total_price = Math.ceil(parsedTotalTicket * event.discount_price!);
    } else {
      total_price = Math.ceil(parsedTotalTicket * event.ticket_price!);
    }

    // bikin create ke prisma
    const order = await prisma.order.create({
      data: {
        buyer_id,
        event_id,
        total_ticket: parsedTotalTicket,
        total_price,
        date: new Date(),
        payment_method: payment_method || null,
        payment_proof: payment_proof || null,
        payment_date: payment_date ? new Date(payment_date) : null,
        status,
      },
    });

    // update availability event dikurangi tiket yg hold
    await prisma.event.update({
      where: { id: event_id },
      data: {
        availability: event.availability - parsedTotalTicket,
      },
    });

    return order;
  }

  async updateOrder(req: Request) {}

  async deleteOrder(req: Request) {
    const { orderId } = req.params;

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    return await prisma.order.delete({
      where: { id: orderId },
    });
  }
}

export default new OrderService();
