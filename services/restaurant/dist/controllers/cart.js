"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.decreaseCartItemQuantity = exports.increaseCartItemQuantity = exports.getCartItems = exports.addTocart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const trycatch_1 = __importDefault(require("../middlewares/trycatch"));
const Cart_1 = __importDefault(require("../models/Cart"));
exports.addTocart = (0, trycatch_1.default)(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id;
    const { restaurantId, itemId } = req.body;
    if (!mongoose_1.default.Types.ObjectId.isValid(restaurantId) ||
        !mongoose_1.default.Types.ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: "Invalid restaurantId or itemId" });
    }
    const cartFromDifferentRestaurant = await Cart_1.default.findOne({
        userId,
        restaurantId: { $ne: restaurantId },
    });
    if (cartFromDifferentRestaurant) {
        return res
            .status(400)
            .json({
            message: "You can only add items from one restaurant at a time. Please clear your cart before adding items from a different restaurant.",
        });
    }
    const existingCartItem = await Cart_1.default.findOneAndUpdate({ userId, restaurantId, itemId }, { $inc: { quantity: 1 }, $setOnInsert: { userId, restaurantId, itemId } }, { upsert: true, new: true, setDefaultsOnInsert: true });
    return res.status(200).json({
        message: "Item added to cart successfully",
        cart: existingCartItem,
    });
});
exports.getCartItems = (0, trycatch_1.default)(async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user._id;
    const cartItems = await Cart_1.default.find({ userId }).populate("itemId").populate("restaurantId");
    let subTotal = 0;
    let cartLength = 0;
    for (const cartItem of cartItems) {
        const item = cartItem.itemId;
        subTotal += item.price * cartItem.quantity;
        cartLength += cartItem.quantity;
    }
    return res.status(200).json({
        success: true,
        cart: cartItems,
        subTotal,
        cartLength,
    });
});
exports.increaseCartItemQuantity = (0, trycatch_1.default)(async (req, res) => {
    const userId = req.user?._id;
    const { itemId } = req.body;
    if (!userId || !itemId) {
        return res.status(400).json({ message: "Invalid Request" });
    }
    const cartItem = await Cart_1.default.findOneAndUpdate({ userId, itemId }, { $inc: { quantity: 1 } }, { new: true });
    if (!cartItem) {
        return res.status(404).json({ message: "Item not found in cart" });
    }
    return res.status(200).json({
        message: "Item quantity increased",
        cart: cartItem,
    });
});
exports.decreaseCartItemQuantity = (0, trycatch_1.default)(async (req, res) => {
    const userId = req.user?._id;
    const { itemId } = req.body;
    if (!userId || !itemId) {
        return res.status(400).json({ message: "Invalid Request" });
    }
    const cartItem = await Cart_1.default.findOne({ userId, itemId });
    if (!cartItem) {
        return res.status(404).json({ message: "Item not found in cart" });
    }
    if (cartItem.quantity === 1) {
        await Cart_1.default.deleteOne({ userId, itemId });
        return res.status(200).json({
            message: "Item removed from cart",
        });
    }
    cartItem.quantity -= 1;
    await cartItem.save();
    return res.status(200).json({
        message: "Item quantity decreased",
        cart: cartItem,
    });
});
exports.clearCart = (0, trycatch_1.default)(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    await Cart_1.default.deleteMany({ userId });
    return res.status(200).json({
        message: "Cart cleared successfully",
    });
});
