const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectToDB = require("./db/db");
// Configure CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

// Import routes
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const rideRoutes = require("./routes/ride.routes");
const paymentRoutes = require("./routes/payment.routes");
const ratingRoutes = require("./routes/rating.routes");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to database
(async () => {
  try {
    await connectToDB();
    console.log("Database connection established");
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
})();

// Root route
app.get("/", (req, res) => {
  res.send("Welcome to Next Ride API");
});

// Routes
app.use("/users", userRoutes);
app.use("/captains", captainRoutes);
app.use("/rides", rideRoutes);
app.use("/payments", paymentRoutes);
app.use("/ratings", ratingRoutes);

module.exports = app;
