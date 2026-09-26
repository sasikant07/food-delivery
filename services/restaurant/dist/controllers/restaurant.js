"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchMyRestaurant = exports.addRestaurant = void 0;
const axios_1 = __importDefault(require("axios"));
const datauri_js_1 = __importDefault(require("../config/datauri.js"));
const trycatch_js_1 = __importDefault(require("../middlewares/trycatch.js"));
const Restaurant_js_1 = __importDefault(require("../models/Restaurant.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.addRestaurant = (0, trycatch_js_1.default)(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorised",
        });
    }
    const existingRestaurant = await Restaurant_js_1.default.findOne({
        ownerId: user._id,
    });
    if (existingRestaurant) {
        return res.status(400).json({
            message: "Your already have a restaurant"
        });
    }
    const { name, description, latitude, longitude, formattedAddress, phone } = req.body;
    if (!name || !latitude || !longitude) {
        return res.status(400).json({
            message: "Please give all details"
        });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "Please upload image"
        });
    }
    const fileBuffer = (0, datauri_js_1.default)(file);
    if (!fileBuffer?.content) {
        return res.status(500).json({
            message: "Failed to create file buffer"
        });
    }
    const { data: uploadResult } = await axios_1.default.post(`${process.env.UTILS_SERVICE}/api/upload`, {
        buffer: fileBuffer.content,
    });
    const restaurant = await Restaurant_js_1.default.create({
        name,
        description,
        phone,
        image: uploadResult.url,
        ownerId: user._id,
        autoLocation: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
            formattedAddress,
        },
        isVerified: false,
    });
    return res.status(201).json({
        message: "Restaurant created successfully",
        restaurant
    });
});
exports.fetchMyRestaurant = (0, trycatch_js_1.default)(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorised",
        });
    }
    const restaurant = await Restaurant_js_1.default.findOne({
        ownerId: req.user._id,
    });
    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found",
        });
    }
    if (!req.user.restaurantId) {
        const token = jsonwebtoken_1.default.sign({
            user: {
                ...req.user,
                restaurantId: restaurant._id,
            }
        }, process.env.JWT_SECRET, {
            expiresIn: "15d"
        });
        return res.json({ restaurant, token });
    }
    return res.json({ restaurant });
});
