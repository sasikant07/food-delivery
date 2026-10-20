"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startPaymentConsumer = void 0;
const axios_1 = __importDefault(require("axios"));
const Order_js_1 = __importDefault(require("../models/Order.js"));
const rabbitmq_js_1 = require("./rabbitmq.js");
const startPaymentConsumer = async () => {
    const channel = (0, rabbitmq_js_1.getChannel)();
    channel.consume(process.env.PAYMENT_QUEUE, async (msg) => {
        if (!msg)
            return;
        try {
            const event = JSON.parse(msg.content.toString());
            if (event.type !== "PAYMENT_SUCCESS") {
                channel.ack(msg);
                return;
            }
            const { orderId } = event.data;
            const order = await Order_js_1.default.findOneAndUpdate({
                _id: orderId,
                paymentStatus: { $ne: "paid" },
            }, {
                $set: {
                    paymentStatus: "paid",
                    status: "placed",
                },
                $unset: {
                    expiresAt: 1,
                },
            }, { new: true });
            if (!order) {
                channel.ack(msg);
                return;
            }
            console.log("✅ Order placed: ", order._id);
            await axios_1.default.post(`${process.env.REALTIME_SERVICE}/api/v1/internal/emit`, {
                event: "order:new",
                room: `Restaurant: ${order.restaurantId}`,
                payload: {
                    orderId: order._id,
                },
            }, {
                headers: {
                    "x-internal-key": process.env.INTERNAL_SERVICE_KEY,
                },
            });
            channel.ack(msg);
        }
        catch (error) {
            console.error("Payment consumer error", error);
        }
    });
};
exports.startPaymentConsumer = startPaymentConsumer;
