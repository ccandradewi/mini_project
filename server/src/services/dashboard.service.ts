import { Request } from "express";
import { prisma } from "../libs/prisma";
import { CategoryName, LocationName, Prisma, Promo } from "@prisma/client";
import { TEvent } from "../model/event.model";
import sharp from "sharp";

class DashboardService {
  async getSellerDashboardMetric(req: Request) {
    console.log("Start fetching data for user dashboard metrics");

    const userId = req.user?.id;

    if (!userId) {
      console.error("User ID is missing");
      throw new Error("User ID is missing");
    }

    try {
      const [orderAggregation, eventCount, groupedOrders] =
        await prisma.$transaction([
          prisma.order.aggregate({
            where: {
              event: {
                user_id: userId,
              },
            },
            _sum: {
              total_ticket: true,
              total_price: true,
            },
          }),
          prisma.event.count({
            where: {
              user_id: userId,
            },
          }),
          prisma.order.groupBy({
            by: ["event_id"],
            where: {
              event: {
                user_id: userId,
              },
            },
            orderBy: {
              event_id: "asc",
            },
            _sum: {
              total_ticket: true,
              total_price: true,
            },
          }),
        ]);

      console.log("Order aggregation result:", orderAggregation);
      console.log("Event count result:", eventCount);
      console.log("Orders grouped by event:", groupedOrders);

      const totalTicketsSold = orderAggregation._sum.total_ticket || 0;
      const totalRevenue = orderAggregation._sum.total_price || 0;
      const totalEventsHeld = eventCount;

      // Extract event IDs from the grouped data
      const eventIds = groupedOrders.map((event) => event.event_id);

      // Fetch additional event details
      const events = await prisma.event.findMany({
        where: {
          id: { in: eventIds },
        },
        select: {
          id: true,
          title: true,
          start_time: true,
          end_time: true,
          venue: true,
          availability: true,
        },
      });

      // Merge event details with aggregated data
      const ticketsAndRevenuePerEvent = groupedOrders.map((event) => {
        const eventData = events.find((e) => e.id === event.event_id);
        return {
          eventId: event.event_id,
          title: eventData?.title || "",
          start_time: eventData?.start_time || null,
          end_time: eventData?.end_time || null,
          venue: eventData?.venue || "",
          totalTicketsSold: event._sum?.total_ticket || 0,
          totalRevenue: event._sum?.total_price || 0,
          availability: eventData?.availability || 0,
        };
      });

      return {
        totalTicketsSold,
        totalEventsHeld,
        totalRevenue,
        ticketsAndRevenuePerEvent,
      };
    } catch (error) {
      console.error("Error fetching seller dashboard metrics:", error);
      throw new Error("Internal server error");
    }
  }

  //   async createReview(req: Request) {
  //     const userId = req.user?.id;
  //     const { description, rating } = req.body;

  //     if (!userId) {
  //       console.error("User ID is missing");
  //       throw new Error("User ID is missing");
  //     }

  //     try {
  //       // Fetch all orders for the user
  //       const orders = await prisma.order.findMany({
  //         where: {
  //           buyer_id: userId,
  //         },
  //         include: {
  //           event: true,
  //         },
  //       });

  //       if (orders.length === 0) {
  //         throw new Error("No orders found for the user");
  //       }

  //       // Find the first order where the event has passed and a review does not exist
  //       const now = new Date();
  //     '  const orderToReview = orders.find(
  // '        (order) => order.event.end_time < now && !order.Review.length
  // '      );
  // '
  //       if (!orderToReview) {
  //         throw new Error("No past events to review or review already exists");
  //       }

  //       // Create the review with the order ID as the review ID
  //       const review = await prisma.review.create({
  //         data: {
  //           id: orderToReview.id, // Using order ID as review ID
  //           user_id: userId,
  //           order_id: orderToReview.id,
  //           description,
  //           rating,
  //         },
  //       });

  //       return review;
  //     } catch (error) {
  //       console.error("Error creating review:", error);
  //     }
  //   }
}

export default new DashboardService();
