"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRazorpayPayment = exports.createRazorpayOrder = void 0;
const axios_1 = __importDefault(require("axios"));
const razorpay_1 = require("../config/razorpay");
const verifyRazorpay_1 = require("../config/verifyRazorpay");
const payment_producer_1 = require("../config/payment.producer");
const createRazorpayOrder = async (req, res) => {
    const { orderId } = req.body;
    const { data } = await axios_1.default.get(`${process.env.RESTAURANT_SERVICE}/api/order/payment/${orderId}`, {
        headers: {
            "x-internal-key": process.env.INTERNAL_SERVICE_KEY,
        },
    });
    const razoprpayOrder = await razorpay_1.razorpay.orders.create({
        amount: data.amount * 100,
        currency: "INR",
        receipt: orderId,
    });
    res.json({
        razorpayOrderId: razoprpayOrder.id,
        key: process.env.RAZORPAY_KEY_SECRET,
    });
};
exports.createRazorpayOrder = createRazorpayOrder;
const verifyRazorpayPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, } = req.body;
    const isValid = (0, verifyRazorpay_1.verifyRazorpaySignature)(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
        return res.status(400).json({
            message: "Payment verification failed",
        });
    }
    await (0, payment_producer_1.publishpaymentSuccess)({
        orderId,
        paymentId: razorpay_payment_id,
        provider: "razorpay",
    });
    res.status(200).json({
        message: "Payment verified successfully!",
    });
};
exports.verifyRazorpayPayment = verifyRazorpayPayment;
