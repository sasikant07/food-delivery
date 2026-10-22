import express from "express";
import {
  createOrder,
  fetchOrderForPayment,
  fetchRestaurantOrders,
  fetchSingleOrder,
  getMyOrders,
  updateOrderStatus,
} from "../controllers/order";
import { isAuth, isSeller } from "../middlewares/isAuth";

const router = express.Router();

router.get("/myorder", isAuth, getMyOrders);
router.get("/restaurant/:restaurantId", isAuth, isSeller, fetchRestaurantOrders);
router.get("/:id", isAuth, fetchSingleOrder);
router.post("/new", isAuth, createOrder);
router.get("/payment/:id", fetchOrderForPayment);
router.put("/:orderId", isAuth, isSeller, updateOrderStatus);

export default router;
