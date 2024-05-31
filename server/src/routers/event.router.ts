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
    this.router.get("/:eventId", eventController.getEventDetail);
    this.router.get("/title", eventController.getEventByTitle);
    this.router.get("/event1", eventController.filterEvent);
    this.router.post(
      "/event2",
      verifyUser,
      verifySeller,
      blobUploader().single("image"),
      eventController.createEvent
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
