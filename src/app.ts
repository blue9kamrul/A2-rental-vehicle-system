import express, { Request, Response } from "express";

// creating instance of express app
const app = express();

// parser
app.use(express.json());

// root route for testing if server is working
app.get("/", (req: Request, res: Response) => {
  res.send("server started");
});

// for invalid route send
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
