import { Router } from "express";
import eventController from "../controllers/event.controller";
import { verifySeller, verifyEventOwner } from "../middlewares/role.middleware";
import { blobUploader } from "../libs/multer";
import {
  validateAccessToken,
  verifyUser,
} from "../middlewares/auth.middleware";

class EventRouter {
  private router: Router;
  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }
  initializedRoutes() {
    this.router.get("/", eventController.getAllEvent);
    this.router.get("/detail/:eventId", eventController.getEventDetail);
    this.router.get(
      "/dashboard/detail/:eventId",
      verifyUser,
      verifySeller,
      verifyEventOwner,
      eventController.getEventDetail
    );
    this.router.get("/title", eventController.getEventTitle);
    this.router.get("/f", eventController.filterEvent);
    this.router.get(
      "/myEvent",
      verifyUser,
      verifySeller,
      eventController.getBySeller
    );
    this.router.post(
      "/",
      verifyUser,
      verifySeller,
      blobUploader().single("banner"),
      eventController.createEvent
    );
    this.router.patch(
      "/:eventId",
      verifyUser,
      verifySeller,
      blobUploader().single("banner"),
      eventController.updateEvent
    );
    this.router.delete(
      "/:eventId",
      verifyUser,
      verifySeller,
      eventController.deleteEvent
    );
    this.router.get("/image/:id", eventController.renderBanner);
    this.router.post("/addReview", eventController.addReview);
    this.router.get(
      "/getReviewByEventId/:eventId",
      eventController.getReviewByEventId
    );
    this.router.get(
      "/getReviewByUserId/:userId",
      eventController.getReviewByUserId
    );
  }
  getRouter() {
    return this.router;
  }
}

export default new EventRouter();
