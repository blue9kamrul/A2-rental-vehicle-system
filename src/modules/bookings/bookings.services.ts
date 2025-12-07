import { pool } from "../../config/db";

// create booking
const createBooking = async (payload: Record<string, any>) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    userId,
    userRole,
  } = payload;

  if (userRole === "customer" && customer_id !== userId) {
    return { error: "You can only create bookings for yourself" };
  }

  // selecting the vehicle
  const vehicleResult = await pool.query(
    `SELECT id, daily_rent_price, vehicle_name, availability_status 
       FROM vehicles 
       WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    return { error: "Vehicle not found" };
  }

  const vehicle = vehicleResult.rows[0];

  // checking if available
  if (vehicle.availability_status !== "available") {
    return { error: "Vehicle is not available for booking" };
  }

  //if available then caculating price
  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);
  const days = Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // checks if startdate is behind end date
  if (days <= 0) {
    return { error: "End date must be after start date" };
  }

  const totalPrice = days * vehicle.daily_rent_price;

  // inserting booking as booked status into the table
  const bookingResult = await pool.query(
    `INSERT INTO bookings 
      (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      totalPrice,
      "active",
    ]
  );

  // Update vehicle availability status to booked
  await pool.query(
    `UPDATE vehicles 
       SET availability_status = $1 
       WHERE id = $2`,
    ["booked", vehicle_id]
  );

  return {
    ...bookingResult.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

// get bookings all for admin one for customer
const getBookings = async (payload: Record<string, any>) => {
  const { role, id } = payload;

  let bookings;
  if (role === "admin") {
    // Admin sees all bookings
    const result = await pool.query("SELECT * FROM bookings ORDER BY id DESC");
    bookings = result.rows;
  } else {
    // Customer sees only their bookings
    const result = await pool.query(
      "SELECT * FROM bookings WHERE customer_id = $1 ORDER BY id DESC",
      [id]
    );
    bookings = result.rows;
  }

  // Auto returned bookings when past end date
  const currentDate = new Date();
  for (let booking of bookings) {
    const endDate = new Date(booking.rent_end_date);
    if (currentDate > endDate && booking.status === "active") {
      // Update booking to returned
      await pool.query(
        `UPDATE bookings SET status = 'returned' WHERE id = $1`,
        [booking.id]
      );

      // Make vehicle available
      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );

      booking.status = "returned";
    }

    // Add customer info for admin view
    if (role === "admin") {
      const customerResult = await pool.query(
        "SELECT name, email FROM users WHERE id = $1",
        [booking.customer_id]
      );
      booking.customer = customerResult.rows[0];
    }
    // Get vehicle info
    const vehicleResult = await pool.query(
      "SELECT vehicle_name, registration_number,type FROM vehicles WHERE id = $1",
      [booking.vehicle_id]
    );

    booking.vehicle = vehicleResult.rows[0];

    if (role === "admin") {
      delete booking.vehicle.type;
    }
  }

  return bookings;
};

// update booking - rolebased
const updateBooking = async (
  bookingId: string,
  payload: Record<string, any>,
  userRole: string,
  userId: number
) => {
  const { status } = payload;

  // Get the booking
  const bookingResult = await pool.query(
    `SELECT * FROM bookings WHERE id = $1`,
    [bookingId]
  );

  if (bookingResult.rows.length === 0) {
    return { error: "Booking not found" };
  }
  const booking = bookingResult.rows[0];

  const currentDate = new Date();

  // Customer can only cancel before start date
  const startDate = new Date(booking.rent_start_date);
  if (userRole === "customer" && status === "cancelled") {
    // customer can cancel only their own bookings
    if (booking.customer_id !== userId) {
      return { error: "You can only cancel your own bookings" };
    }

    if (currentDate >= startDate) {
      return {
        error: "Cannot cancel booking after rental period has started",
      };
    }

    // Update booking to cancelled
    const updatedBooking = await pool.query(
      `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
      ["cancelled", bookingId]
    );

    // Make vehicle available again
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );
    return updatedBooking.rows[0];
  }

  // Admin can return bookings
  if (userRole === "admin") {
    if (status === "returned") {
      const updatedBooking = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        ["returned", bookingId]
      );

      // Make vehicle available
      const vehicleResult = await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1 RETURNING availability_status`,
        [booking.vehicle_id]
      );

      return {
        ...updatedBooking.rows[0],
        vehicle: {
          availability_status: vehicleResult.rows[0].availability_status,
        },
      };
    } else if (status) {
      // Admin can update to all status
      const updatedBooking = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        [status, bookingId]
      );
      await pool.query(
        `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
        [booking.vehicle_id]
      );
      return updatedBooking.rows[0];
    }
  }
  return { error: "Could not update booking" };
};

export const bookingServices = {
  createBooking,
  getBookings,
  updateBooking,
};
