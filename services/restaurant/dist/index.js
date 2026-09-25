"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
const restaurant_js_1 = __importDefault(require("./routes/restaurant.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5060;
app.use("/api/restaurant", restaurant_js_1.default);
app.listen(PORT, () => {
    console.log(`Restaurant service is running on port ${PORT}`);
    (0, db_1.default)();
});
