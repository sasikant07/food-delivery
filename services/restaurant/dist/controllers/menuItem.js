"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleMenuItemAvailability = exports.deletemenuItem = exports.getAllItems = exports.addMenuItem = void 0;
const axios_1 = __importDefault(require("axios"));
const datauri_1 = __importDefault(require("../config/datauri"));
const trycatch_1 = __importDefault(require("../middlewares/trycatch"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const MenuItems_1 = __importDefault(require("../models/MenuItems"));
exports.addMenuItem = (0, trycatch_1.default)(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Please login to continue"
        });
    }
    const restaurant = await Restaurant_1.default.findOne({
        ownerId: req.user._id
    });
    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found"
        });
    }
    const { name, description, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({
            message: "Name and Price are required"
        });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "Please upload image"
        });
    }
    const fileBuffer = (0, datauri_1.default)(file);
    if (!fileBuffer?.content) {
        return res.status(500).json({
            message: "Failed to create file buffer"
        });
    }
    const { data: uploadResult } = await axios_1.default.post(`${process.env.UTILS_SERVICE}/api/upload`, {
        buffer: fileBuffer.content,
    });
    const item = await MenuItems_1.default.create({
        restaurantId: restaurant._id,
        name,
        description,
        price,
        image: uploadResult.url
    });
    return res.status(201).json({
        message: "Item added successfully",
        item
    });
});
exports.getAllItems = (0, trycatch_1.default)(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            message: "Id is required"
        });
    }
    const items = await MenuItems_1.default.find({ restaurantId: id });
    return res.status(200).json(items);
});
exports.deletemenuItem = (0, trycatch_1.default)(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Please login to continue"
        });
    }
    const { itemId } = req.params;
    if (!itemId) {
        return res.status(400).json({
            message: "ItemId is required"
        });
    }
    const item = await MenuItems_1.default.findById(itemId);
    if (!item) {
        return res.status(404).json({
            message: "Item not found"
        });
    }
    const restaurant = await Restaurant_1.default.findOne({
        _id: item.restaurantId,
        ownerId: req.user._id
    });
    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found"
        });
    }
    await item.deleteOne();
    res.status(200).json({
        message: "Menu item deleted successfully"
    });
});
exports.toggleMenuItemAvailability = (0, trycatch_1.default)(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Please login to continue"
        });
    }
    const { itemId } = req.params;
    if (!itemId) {
        return res.status(400).json({
            message: "ItemId is required"
        });
    }
    const item = await MenuItems_1.default.findById(itemId);
    if (!item) {
        return res.status(404).json({
            message: "Item not found"
        });
    }
    const restaurant = await Restaurant_1.default.findOne({
        _id: item.restaurantId,
        ownerId: req.user._id
    });
    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found"
        });
    }
    item.isAvailable = !item.isAvailable;
    await item.save();
    res.status(200).json({
        messgae: `Item marked as ${item.isAvailable ? "available" : "unavailable"}`,
        item
    });
});
