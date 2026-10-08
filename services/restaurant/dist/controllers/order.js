"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOrderForPayment = exports.createOrder = void 0;
const trycatch_1 = __importDefault(require("../middlewares/trycatch"));
const Address_1 = __importDefault(require("../models/Address"));
const Cart_1 = __importDefault(require("../models/Cart"));
const Order_1 = __importDefault(require("../models/Order"));
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
exports.createOrder = (0, trycatch_1.default)(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    const { paymentMethod, addressId, distance } = req.body;
    if (!addressId) {
        return res.status(400).json({
            message: "Address is required",
        });
    }
    const address = await Address_1.default.findOne({
        _id: addressId,
        userId: user._id,
    });
    if (!address) {
        return res.status(404).json({
            message: "Address not found",
        });
    }
    const cartItems = await Cart_1.default.find({ userId: user._id })
        .populate("itemId")
        .populate("restaurantId");
    if (cartItems.length === 0) {
        return res.status(400).json({
            message: "Cart is empty",
        });
    }
    const firstCartItem = cartItems[0];
    if (!firstCartItem || !firstCartItem.restaurantId) {
        return res.status(400).json({
            message: "Inavlid cart data",
        });
    }
    const restaurantId = firstCartItem.restaurantId._id;
    const restaurant = await Restaurant_1.default.findById(restaurantId);
    if (!restaurant) {
        return res.status(404).json({
            message: "No Restaurant with this Id",
        });
    }
    if (!restaurant.isOpen) {
        return res.status(400).json({
            message: "Sorry! this restaurant is closed for now",
        });
    }
    let subTotal = 0;
    const orderItems = cartItems.map((cart) => {
        const item = cart.itemId;
        if (!item) {
            throw new Error("Invalid cart item");
        }
        const itemTotal = item.price * cart.quantity;
        subTotal += itemTotal;
        return {
            itemId: item._id.toString(),
            name: item.name,
            price: item.price,
            quantity: cart.quantity,
        };
    });
    const deliveryFee = subTotal < 250 ? 49 : 0;
    const platformFee = 7;
    const totalAmount = subTotal + deliveryFee + platformFee;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const [longitude, latitude] = address.location.coordinates;
    const riderAmount = Math.ceil(distance) * 17;
    const order = await Order_1.default.create({
        userId: user._id.toString(),
        restaurantId: restaurantId.toString(),
        restaurantName: restaurant.name,
        riderId: null,
        distance,
        riderAmount,
        items: orderItems,
        subTotal,
        deliveryFee,
        platformFee,
        totalAmount,
        addressId: address._id.toString(),
        deliveryAddress: {
            formattedAddress: address.formattedAddress,
            mobile: address.mobile,
            latitude,
            longitude,
        },
        paymentMethod,
        paymentStatus: "pending",
        status: "placed",
        expiresAt,
    });
    await Cart_1.default.deleteMany({ userId: user._id });
    res.status(201).json({
        message: "Order created successfully",
        orderId: order._id.toString(),
        amount: totalAmount,
    });
});
exports.fetchOrderForPayment = (0, trycatch_1.default)(async (req, res) => {
    if (req.headers["x-internal-key"] !== process.env.INTERNAL_SERICE_KEY) {
        return res.status(403).json({
            message: "Forbidden"
        });
    }
    const order = await Order_1.default.findById(req.params.id);
    if (!order) {
        return res.status(404).json({
            message: "Order not found"
        });
    }
    if (order.paymentStatus !== "pending") {
        return res.status(400).json({
            message: "Order already is paid"
        });
    }
    return res.status(200).json({
        orderId: order._id,
        amount: order.totalAmount,
        currency: "INR",
    });
});
