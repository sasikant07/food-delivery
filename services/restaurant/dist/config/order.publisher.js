"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publisheEvent = void 0;
const rabbitmq_js_1 = require("./rabbitmq.js");
const publisheEvent = async (type, data) => {
    const channel = (0, rabbitmq_js_1.getChannel)();
    channel.sendToQueue(process.env.ORDER_READY_QUEUE, Buffer.from(JSON.stringify({ type, data })), { persistent: true });
};
exports.publisheEvent = publisheEvent;
