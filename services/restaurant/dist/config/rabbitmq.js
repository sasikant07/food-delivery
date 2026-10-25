"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChannel = exports.connectRabbitMQ = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
let channel;
const connectRabbitMQ = async () => {
    const connection = await amqplib_1.default.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue(process.env.PAYMENT_QUEUE, {
        durable: true,
    });
    await channel.assertQueue(process.env.RIDER_QUEUE, { durable: true });
    console.log("🐇 connected to Rabbitmq(restaurant service)");
};
exports.connectRabbitMQ = connectRabbitMQ;
const getChannel = () => channel;
exports.getChannel = getChannel;
