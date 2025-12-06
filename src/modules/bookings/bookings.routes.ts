import { Router } from "express";
import { bookingController } from "./bookings.controllers";
import auth from "../../middleware/auth";

const router = Router();

// booking creation
router.post("/", auth("admin", "customer"), bookingController.createBooking);

// retrieve all bookings
router.get("/", auth("admin", "customer"), bookingController.getBookings);

// update bookings
router.put(
  "/:bookingId",
  auth("admin", "customer"),
  bookingController.updateBooking
);

const bookingRoutes = router;
export default bookingRoutes;
