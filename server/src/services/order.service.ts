import { Request } from "express";
import { prisma } from "../libs/prisma";
import { Prisma, StatusOrder } from "@prisma/client";
import { TEvent } from "../model/event.model";
import sharp from "sharp";
import { TOrder } from "../model/order.model";
import { generateInvoice } from "../utils/invoice";

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
        inv_id: true,
        event: {
          select: {
            id: true,
            banner: true,
            title: true,
            description: true,
            start_time: true,
            end_time: true,
            location: true,
            ticket_price: true,
            promotor: true,
            discount_price: true,
            promo: true,
            venue: true,
            start_promo: true,
            end_promo: true,
            type: true,
          },
        },
      },
    });

    if (!data) {
      throw new Error("Order not found");
    }

    return data;
  }

  async getOrderByBuyerId(req: Request) {
    const data = await prisma.order.findMany({
      where: { buyer_id: req.user?.id },
      orderBy: {
        updatedAt: "desc",
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
    const data = await prisma.order.findMany({
      where: {
        event: {
          user_id: req.user?.id,
        },
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
        inv_id: true,
        event: {
          select: {
            id: true,
            title: true,
            city: true,
            category: true,
            start_time: true,
            end_time: true,
            availability: true,
            promo: true,
            start_promo: true,
            end_promo: true,
            venue: true,
            discount_price: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
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
      payment_method,
      use_voucher,
      use_point,
      status = "pending",
      total_price,
    } = req.body;

    const { total_ticket } = req.body;
    const parsedTotalTicket = parseInt(total_ticket, 10);

    console.log("Received request body:", req.body);

    if (!buyer_id || !event_id || !total_ticket) {
      throw new Error("Missing required fields");
    }

    console.log("Required fields validation successful");

    const event = await prisma.event.findUnique({ where: { id: event_id } });
    if (!event) throw new Error("Invalid event");

    if (event.availability < total_ticket)
      throw new Error("Not enough available tickets");

    if ((use_voucher || use_point) && event.type === "FREE") {
      throw new Error("Cannot use voucher or points for free events");
    }

    let adjustedTotalPrice = total_price;

    // Calculate adjusted total price considering points usage
    if (use_point) {
      const pointData = await prisma.voucherPoint.findFirst({
        where: {
          user_id: buyer_id,
        },
      });

      console.log("Point data found:", pointData);

      if (!pointData?.point || pointData?.point === 0) {
        throw new Error("You have no points");
      }

      const ticketPrice = event?.ticket_price ?? 0;
      const pointToDeduct = total_ticket * ticketPrice;
      adjustedTotalPrice -= Math.min(pointData.point, pointToDeduct);

      await prisma.voucherPoint.update({
        where: { id: pointData.id },
        data: {
          point: Math.max(0, pointData.point - pointToDeduct),
        },
      });
    }

    // Apply voucher discount if applicable
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
    console.log("test");

    adjustedTotalPrice = Math.max(0, adjustedTotalPrice);

    // update availability di model event
    await prisma.event.update({
      where: { id: event_id },
      data: {
        availability: event.availability - total_ticket,
      },
    });

    // generating invoice
    const generateRandomString = (length: number) => {
      let result = "";
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    };

    const generateInvoice = (id: string) => {
      const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
      const eventIdPrefix = id.substring(0, 5).toUpperCase();
      const randomString = generateRandomString(5).toUpperCase();
      return `INV-${date}-${eventIdPrefix}-${randomString}`;
    };

    console.log("setelah generate invoicec");

    const order = await prisma.order.create({
      data: {
        user: { connect: { id: buyer_id } },
        event: { connect: { id: event_id } },
        total_ticket: parsedTotalTicket,
        total_price: adjustedTotalPrice,
        date: new Date(),
        payment_method: payment_method || null,
        status,
        inv_id: generateInvoice(event_id),
      },
    });

    setTimeout(async () => {
      const expireOrder = await prisma.order.findUnique({
        where: { id: order.id },
      });
      if (expireOrder && expireOrder.status === "pending") {
        // Cancel the order
        await prisma.order.update({
          where: { id: expireOrder.id },
          data: { status: "cancelled" },
        });

        // Refund points if they were used
        if (
          expireOrder &&
          expireOrder.status === "pending" &&
          req.body.use_point === true
        ) {
          // Get event details
          const event = await prisma.event.findUnique({
            where: { id: expireOrder.event_id },
          });

          if (event) {
            const pointData = await prisma.voucherPoint.findFirst({
              where: { user_id: expireOrder.buyer_id },
            });

            if (pointData) {
              // Calculate the points to refund
              const pointsUsed =
                expireOrder.total_ticket * (event.ticket_price || 0);
              const newPointBalance = pointData.point + pointsUsed;

              // Update the user's point balance
              await prisma.voucherPoint.update({
                where: { id: pointData.id },
                data: { point: newPointBalance },
              });
            }
          }
        }

        if (
          expireOrder &&
          expireOrder.status === "pending" &&
          req.body.use_voucher === true
        ) {
          // Get event details
          const event = await prisma.event.findUnique({
            where: { id: expireOrder.event_id },
          });

          if (event) {
            const pointData = await prisma.voucherPoint.findFirst({
              where: { user_id: expireOrder.buyer_id },
            });

            // Update the user's point balance
            await prisma.voucherPoint.update({
              where: { id: pointData?.id },
              data: {
                voucher: 0.1,
                isValid: true,
              },
            });
          }
        }
      }
    }, 10 * 60 * 1000);

    return order;
  }

  async updateOrder(req: Request) {
    const { orderId } = req.params;
    const { file } = req;
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        event: true,
      },
    });

    if (!order) {
      throw new Error("Order Not Found");
    }

    let paymentProofBuffer: Buffer | null = order.payment_proof;
    let status = order.status;

    if (file) {
      paymentProofBuffer = await sharp(file.buffer).png().toBuffer();
      status = "confirmed";
    }
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        payment_date: new Date(),
        payment_proof: paymentProofBuffer,
        status: status,
        updatedAt: new Date(),
      },
    });
    return updatedOrder;
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
  async getTicket(req: Request) {
    const { orderId } = req.params;
    const order = await prisma.order.findMany({
      where: { id: orderId },
      select: {
        id: true,
        total_ticket: true,
        total_price: true,
        payment_method: true,
        inv_id: true,
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            venue: true,
            start_time: true,
            banner: true,
            location: true,
          },
        },
      },
    });
    return order;
  }
}

// TODO: update order, validate voucher/point, service fetch voucherpoint

export default new OrderService();
