"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_js_1 = require("../socket.js");
const router = express_1.default.Router();
router.post("/emit", (req, res) => {
    if (req.headers["x-internal-key"] !== process.env.INTERNAL_SERVICE_KEY) {
        return res.status(403).json({
            message: "Forbidden",
        });
    }
    const { event, room, payload } = req.body;
    if (!event || !room) {
        return res.status(400).json({
            message: "Event and room are required",
        });
    }
    const io = (0, socket_js_1.getIO)();
    console.log(`🛜 Emitting event ${event} to room ${room}`);
    io.to(room).emit(event, payload ?? {});
    return res.status(200).json({ success: true });
});
exports.default = router;
