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

  async getOrderId(req: Request) {
    const { buyer_id, event_id, total_price } = req.body;

    if (!buyer_id || !event_id || !total_price) {
      throw new Error("Missing required parameters");
    }

    const data = await prisma.order.findFirst({
      where: {
        buyer_id: buyer_id.toString(), // Mengonversi ke string jika diperlukan
        event_id: event_id.toString(),
        total_price: parseFloat(total_price.toString()), // Jika total_price adalah string, konversi ke float
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

    if (!data) throw new Error("Order not found");

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
      status = StatusOrder.pending,
      total_price, // Assuming total_price is calculated on the frontend
    } = req.body;

    // Log the received request body
    console.log("Received request body:", req.body);

    // Validate required fields
    if (!buyer_id || !event_id || !total_ticket) {
      throw new Error("Missing required fields");
    }

    // Log validation success
    console.log("Required fields validation successful");

    // Fetch the event and validate it
    const event = await prisma.event.findUnique({ where: { id: event_id } });
    if (!event) throw new Error("Invalid event");

    // Log event details
    console.log("Event details:", event);

    if (event.availability < total_ticket)
      throw new Error("Not enough available tickets");

    // Log event validation success
    console.log("Event validation successful");

    // Validate voucher and point usage for free events
    if ((use_voucher || use_point) && event.type === "FREE") {
      throw new Error("Cannot use voucher or points for free events");
    }

    // Log voucher and point validation success
    console.log("Voucher and point validation successful");

    let adjustedTotalPrice = total_price;

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
        const ticketPrice = event?.ticket_price ?? 0; // Retrieve ticket price from event
        const pointToDeduct = total_ticket * ticketPrice;
        if (pointData.point >= pointToDeduct) {
          // If points are greater than or equal to the total price of tickets
          await prisma.voucherPoint.update({
            where: { id: pointData.id },
            data: {
              point: pointData.point - pointToDeduct,
            },
          });
        } else {
          // If points are less than the total price of tickets
          await prisma.voucherPoint.update({
            where: { id: pointData.id },
            data: {
              point: 0,
              expired_date: currentDate,
            },
          });
        }

        console.log("Points updated:", pointData);
      }
    }

    if (use_voucher) {
      console.log("Using voucher");

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

      // Apply a 10% discount
      const voucherDiscount = adjustedTotalPrice * 0.1;
      adjustedTotalPrice -= voucherDiscount;

      await prisma.voucherPoint.update({
        where: { id: voucher.id },
        data: {
          isValid: false,
          voucher: 0,
        },
      });
    }

    // Ensure total price is not negative
    adjustedTotalPrice = Math.max(0, adjustedTotalPrice);

    // Update event availability
    await prisma.event.update({
      where: { id: event_id },
      data: {
        availability: event.availability - total_ticket,
      },
    });

    // Log event availability update success
    console.log("Event availability update successful");

    // Create the order
    const order = await prisma.order.create({
      data: {
        buyer_id,
        event_id,
        total_ticket,
        total_price: adjustedTotalPrice,
        date: new Date(),
        payment_method: payment_method || null,
        status,
      },
    });

    // Log order creation success
    console.log("Order creation successful:", order);

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
