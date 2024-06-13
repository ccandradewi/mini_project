import { Request } from "express";
import { prisma } from "../libs/prisma";
import { TReview } from "../model/review.model";
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
  async addReview(req: Request) {
    const { event_id, description, rating } = req.body;
    const findReviewId = await prisma.review.findMany({
      where: {
        event_id: event_id,
        description: description,
        rating: rating,
      },
    });

    if (findReviewId.length > 0) {
      const updateReview = await prisma.review.update({
        where: { id: findReviewId[0].id },
        data: {
          description: description,
          rating: rating,
        },
      });
      return updateReview;
    } else {
      return "Unable to add more review. You have added review for this event";
    }
  }
  async getReviewByEventId(req: Request) {
    const { eventId } = req.params;
    const findReviewId = await prisma.review.findMany({
      where: {
        event_id: eventId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    if (findReviewId) {
      return findReviewId;
    } else {
      return "No one has bought the event so no review yet";
    }
  }
  async getReviewByUserId(req: Request) {
    const { userId } = req.params;
    const findReviewId = await prisma.review.findMany({
      where: { user_id: userId },
    });
    if (findReviewId) {
      return findReviewId;
    } else {
      return "No one has bought the event so no review yet";
    }
  }
}

export default new DashboardService();
