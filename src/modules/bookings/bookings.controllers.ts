import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";

// create booking
const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req.body);
    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

//get bookings all for admin and one for customer
const getBookings = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.getBookings(req.user!);
    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: error.message,
    });
  }
};

//update bookings
const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId;
    const userRole = req.user?.role;
    const userId = req.user?.id;

    const result = await bookingServices.updateBooking(
      bookingId!,
      req.body,
      userRole!,
      userId!
    );

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: result.error,
      });
    }
    let message = "Booking updated successfully";
    if (req.body.status === "cancelled") {
      message = "Booking cancelled successfully";
    } else if (req.body.status === "returned") {
      message = "Booking marked as returned. Vehicle is now available";
    }

    res.status(200).json({
      success: true,
      message: message,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBooking,
};
