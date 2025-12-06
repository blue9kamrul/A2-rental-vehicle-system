import { pool } from "../../config/db";

// create booking
const createBooking = async (payload: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
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

  // inserting booking as boked status into the table
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

  // 4. Update vehicle availability status to 'booked'
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

  const customer = await pool.query(
    `
    SELECT name, email FROM users WHERE id = $1 `,
    [id]
  );

  //   const vehicle = await pool.query(
  //     ` SELECT vehicle_name, registration_number FROM vehicles
  //       WHERE id = $1`,
  //     [id]
  //   );
  let result;
  if (role === "admin") {
    result = await pool.query("SELECT * FROM bookings");
  } else {
    result = await pool.query("SELECT * FROM bookings WHERE customer_id = $1", [
      id,
    ]);
  }
  const bookingResult = [{ ...result.rows, customer: customer.rows[0] }];
  return bookingResult;
};

// update booking - role-based
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

  // auto return
  const currentDate = new Date();
  const endDate = new Date(booking.rent_end_date);

  if (currentDate > endDate && booking.status === "active") {
    // Automatically mark as returned if period has ended
    const updatedBooking = await pool.query(
      `UPDATE bookings SET status = 'returned' WHERE id = $1 RETURNING *`,
      [bookingId]
    );
  }

  await pool.query(
    `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
    [booking.vehicle_id]
  );

  // Customer can only cancel their own bookings
  if (userRole === "customer") {
    if (booking.customer_id !== userId) {
      return { error: "You can only cancel your own bookings" };
    }

    if (booking.status === "returned" || booking.status === "cancelled") {
      return {
        error: "Cannot cancel a booking that is already completed or cancelled",
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

  // Admin can return
  if (userRole === "admin") {
    if (status === "returned") {
      const updatedBooking = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        ["returned", bookingId]
      );

      // Getting vehicle and making it available
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
    } else {
      // Admin can update to any status
      const updatedBooking = await pool.query(
        `UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *`,
        [status, bookingId]
      );
      return updatedBooking.rows[0];
    }
  }

  await pool.query("ROLLBACK");
  return { error: "Invalid operation" };
};

export const bookingServices = {
  createBooking,
  getBookings,
  updateBooking,
};
