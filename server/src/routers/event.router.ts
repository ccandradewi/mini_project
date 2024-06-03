import { Router } from "express";
import eventController from "../controllers/event.controller";
import { verifySeller } from "../middlewares/role.middleware";
import { blobUploader } from "../libs/multer";
import { verifyUser } from "../middlewares/auth.middleware";

class EventRouter {
  private router: Router;
  constructor() {
    this.router = Router();
    this.initializedRoutes();
  }
  initializedRoutes() {
    this.router.get("/", eventController.getAllEvent);
    this.router.get("/detai/:eventId", eventController.getEventDetail);
    this.router.get("/title", eventController.getEventTitle);
    this.router.get("/filter", eventController.filterEvent);
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
      blobUploader().single("image"),
      eventController.createEvent
    );
    this.router.patch(
      "/:eventId",
      verifyUser,
      verifySeller,
      blobUploader().single("image"),
      eventController.updateEvent
    );
    this.router.delete(
      "/:eventId",
      verifyUser,
      verifySeller,
      eventController.deleteEvent
    );
    this.router.get("/image/:id", eventController.renderBanner);
  }
  getRouter() {
    return this.router;
  }
}

export default new EventRouter();
