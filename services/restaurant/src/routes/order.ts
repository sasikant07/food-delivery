import express from "express";
import { createOrder, fetchOrderForPayment, fetchRestaurantOrders, updateOrderSttaus } from "../controllers/order";
import { isAuth, isSeller } from "../middlewares/isAuth";

const router = express.Router();

router.post("/new", isAuth, createOrder);
router.get("/payment/:id", fetchOrderForPayment);
router.get("/:restaurantId", isAuth, isSeller, fetchRestaurantOrders );
router.put("/:orderId", isAuth, isSeller, updateOrderSttaus );

export default router;