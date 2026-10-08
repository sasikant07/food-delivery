import express from "express";
import { createOrder, fetchOrderForPayment } from "../controllers/order";
import { isAuth } from "../middlewares/isAuth";

const router = express.Router();

router.post("/new", isAuth, createOrder);
router.get("/payment", fetchOrderForPayment);

export default router;