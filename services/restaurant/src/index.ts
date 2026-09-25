import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import restaurantRoutes from "./routes/restaurant.js"

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5060;

app.use("/api/restaurant", restaurantRoutes);

app.listen(PORT, () => {
  console.log(`Restaurant service is running on port ${PORT}`);
  connectDB();
});