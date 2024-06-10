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
        event: {
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
        },
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

  async getVoucherPoint(req: Request) {
    const { buyerId } = req.params;
    const data = await prisma.voucherPoint.findMany({
      where: { user_id: buyerId },
      select: {
        id: true,
        user_id: true,
        point: true,
        expired_date: true,
        voucher: true,
        isValid: true,
        createdAt: true,
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
      use_voucher,
      use_point,
      // point sm voucher true/false ketika user mau pake voucher apa enggak
      status = StatusOrder.pending,
    } = req.body;

    // VALIDATE KETIKA HARGA TIKET < TOTAL POINT
    // ketika tiket > point
    // point = 100.000
    // tiket = 30.000
    // point = point - hargatiket -> update model VoucherPoint
    // harga tiket = 0 -> model Order

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

    if (use_voucher && use_point) {
      throw new Error("Cannot use both voucher and points in a single order");
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

    // cek gak bisa pakai voucher kalo event free
    if (use_voucher && event.type === "FREE") {
      throw new Error("Cannot use voucher for free events");
    }

    // cek gak bisa pakai point kalo event free
    if (use_point && event.type === "FREE") {
      throw new Error("Cannot use points for free events");
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

    // jadi kayak ordernya berhenti di function yg ini . log yg keluar cuma ini
    console.log("Initial total_price:", total_price);

    if (use_voucher) {
      if (use_voucher) console.log("using voucher");

      // const currentDate = new Date();
      const voucher = await prisma.voucherPoint.findFirst({
        where: {
          user_id: buyer_id,
          isValid: true,
        },
      });

      console.log("Voucher found:", voucher);

      if (!voucher || voucher.voucher === 0) {
        throw new Error("You have no voucher");
      }

      // total price ketika pake voucher dan valid
      if (voucher) {
        total_price = total_price - total_price * 0.1;

        console.log("Discount applied, new total_price:", total_price);

        // Update voucher point
        await prisma.voucherPoint.update({
          where: { id: voucher.id },
          data: {
            isValid: false,
            voucher: 0,
          },
        });
      }
    }

    if (use_point) {
      const currentDate = new Date();
      const pointData = await prisma.voucherPoint.findFirst({
        where: {
          user_id: buyer_id,
        },
      });

      console.log("Point data found:", pointData);

      if (!pointData?.point || pointData?.point === 0) {
        throw new Error("You have no points");
      }

      if (pointData) {
        // gabisa kalo harga tiket lebih mahal dari poin
        if (total_price <= pointData.point) {
          throw new Error("Total price must be greater than total points");
        }

        if (pointData) {
          total_price = Math.max(0, total_price - pointData.point);
          // total price gak boleh kurang dari 0 utk bs pake voucher

          console.log("Point applied, new total_price:", total_price);

          // update tabel voucher point -> point jd 0, dan gbs dipake lg
          await prisma.voucherPoint.update({
            where: { id: pointData.id },
            data: {
              point: 0,
              expired_date: currentDate,
            },
          });

          console.log("Point updated:", pointData);
        }
      }

      // update availability event dikurangi tiket yg hold
      await prisma.event.update({
        where: { id: event_id },
        data: {
          availability: event.availability - parsedTotalTicket,
        },
      });
    }
    const order = await prisma.order.create({
      data: {
        buyer_id,
        event_id,
        total_ticket: parsedTotalTicket,
        total_price,
        date: new Date(),
        payment_method: payment_method || null,
        status,
      },
    });

    return order;
  }

  // router.push(/invoice/{orderId})

  async updateOrder(req: Request) {
    // upload payment
    // keluarin payment date
    // ganti status -> confirmed
    // nodemailer eticket
  }

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

// TODO: update order, validate voucher/point, service fetch voucherpoint

export default new OrderService();
