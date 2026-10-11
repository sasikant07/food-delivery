import express from "express";
import connectDB from "./config/db";
import dotenv from "dotenv";
import restaurantRoutes from "./routes/restaurant.js";
import itemRoutes from "./routes/menuItem.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";
import cors from "cors";
import { connectRabbitMQ } from "./config/rabbitmq";
import { startPaymentConsumer } from "./config/payment.consumer";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5080;

app.use("/api/restaurant", restaurantRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);

async function startServer() {
  await connectRabbitMQ();
  startPaymentConsumer();

  app.listen(PORT, () => {
    console.log(`Restaurant service is running on port ${PORT}`);
    connectDB();
  });
}

void startServer();