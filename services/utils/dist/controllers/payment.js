"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyStripe = exports.payWithStripe = exports.verifyRazorpayPayment = exports.createRazorpayOrder = void 0;
const axios_1 = __importDefault(require("axios"));
const razorpay_1 = require("../config/razorpay");
const verifyRazorpay_1 = require("../config/verifyRazorpay");
const payment_producer_1 = require("../config/payment.producer");
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
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
        key: process.env.RAZORPAY_KEY_ID,
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
const payWithStripe = async (req, res) => {
    try {
        const { orderId } = req.body;
        const { data } = await axios_1.default.get(`${process.env.RESTAURANT_SERVICE}/api/order/payment/${orderId}`, {
            headers: {
                "x-internal-key": process.env.INTERNAL_SERVICE_KEY,
            },
        });
        const session = await stripe.checkout.sessions.create({
            allowed_payment_method_types: ["card"],
            mode: "payment",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: "Tomato food order",
                        },
                        unit_amount: data.amount * 100,
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                orderId,
            },
            success_url: `${process.env.FRONTEND_URL}/ordersuccess?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout`,
        });
        res.json({
            url: session.url,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Stripe payment failed",
        });
    }
};
exports.payWithStripe = payWithStripe;
const verifyStripe = async (req, res) => {
    const { sessionId } = req.body;
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
            return res.status(400).json({
                message: "Payment verification failed",
            });
        }
        const orderId = session.metadata?.orderId;
        if (!orderId) {
            return res.status(400).json({
                message: "OrderId not found in stripe session",
            });
        }
        await (0, payment_producer_1.publishpaymentSuccess)({
            orderId,
            paymentId: sessionId,
            provider: "stripe",
        });
        res.json({
            message: "Payment verified successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Stripe payment failed",
        });
    }
};
exports.verifyStripe = verifyStripe;
