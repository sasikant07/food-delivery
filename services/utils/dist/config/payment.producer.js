"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishpaymentSuccess = void 0;
const rabbitmq_1 = require("./rabbitmq");
const publishpaymentSuccess = async (payload) => {
    const channel = (0, rabbitmq_1.getChannel)();
    channel.sendToQueue(process.env.PAYMENT_QUEUE, Buffer.from(JSON.stringify({
        type: "PAYMENT_SUCCESS",
        data: payload,
    })), { persistent: true });
};
exports.publishpaymentSuccess = publishpaymentSuccess;
