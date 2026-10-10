"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payment_1 = require("../controllers/payment");
const router = express_1.default.Router();
router.post("/create", payment_1.createRazorpayOrder);
router.post("/verify", payment_1.verifyRazorpayPayment);
exports.default = router;
