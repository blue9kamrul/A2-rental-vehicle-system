import express, { Request, Response } from "express";
import initDB from "./config/db";
import userRoutes from "./modules/users/user.routes";
import authRoutes from "./modules/auth/auth.routes";
import vehicleRoutes from "./modules/vehicles/vehicles.routes";
import auth from "./middleware/auth";
import bookingRoutes from "./modules/bookings/bookings.routes";

// creating instance of express app
const app = express();

// parser
app.use(express.json());

// initializing DB
initDB();

//auth routes
app.use("/api/v1/auth", authRoutes);

//vehicles routes
app.use("/api/v1/vehicles", vehicleRoutes);

//users routes -
app.use("/api/v1/users", userRoutes);

//booking routes
app.use("/api/v1/bookings", bookingRoutes);

// root route for testing if server is working
app.get("/", (req: Request, res: Response) => {
  res.send("server started");
});

// for invalid route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
