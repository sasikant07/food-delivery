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
router.post("/stripe/create", payment_1.payWithStripe);
router.post("/stripe/verify", payment_1.verifyStripe);
exports.default = router;
