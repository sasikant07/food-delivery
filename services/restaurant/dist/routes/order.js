"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_1 = require("../controllers/order");
const isAuth_1 = require("../middlewares/isAuth");
const router = express_1.default.Router();
router.post("/new", isAuth_1.isAuth, order_1.createOrder);
router.get("/payment", order_1.fetchOrderForPayment);
exports.default = router;
