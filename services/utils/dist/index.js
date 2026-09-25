"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const cors_1 = __importDefault(require("cors"));
const cloudinary_js_1 = __importDefault(require("./routes/cloudinary.js"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true }));
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_SECRET_KEY } = process.env;
if (!CLOUD_NAME || !CLOUD_API_KEY || !CLOUD_SECRET_KEY) {
    throw new Error("Missing Cloudinary environment variables");
}
cloudinary_1.default.v2.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_SECRET_KEY,
});
app.use("/api", cloudinary_js_1.default);
const PORT = process.env.PORT || 5070;
app.listen(PORT, () => {
    console.log(`Utils service is running on port ${PORT}`);
});
