"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyAddressess = exports.deleteAddress = exports.addAddress = void 0;
const trycatch_1 = __importDefault(require("../middlewares/trycatch"));
const Address_1 = __importDefault(require("../models/Address"));
exports.addAddress = (0, trycatch_1.default)(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    const { mobile, formattedAddress, latitude, longitude } = req.body;
    if (!mobile ||
        !formattedAddress ||
        latitude === undefined ||
        longitude === undefined) {
        return res.status(400).json({
            message: "Please provide all the details",
        });
    }
    const newAddress = await Address_1.default.create({
        userId: user._id.toString(),
        mobile,
        formattedAddress,
        location: {
            type: "Point",
            coordinates: [Number(longitude), Number(latitude)],
        },
    });
    res.status(201).json({
        message: "Address added successfully!",
        address: newAddress,
    });
});
exports.deleteAddress = (0, trycatch_1.default)(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            message: "Id is required",
        });
    }
    const address = await Address_1.default.findOne({
        _id: id,
        userId: user._id.toString(),
    });
    if (!exports.addAddress) {
        return res.status(404).json({
            message: "Address not found",
        });
    }
    await address?.deleteOne();
    return res.status(200).json({
        message: "Address deleted successfully!",
    });
});
exports.getMyAddressess = (0, trycatch_1.default)(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    const addressess = await Address_1.default.find({
        userId: user._id.toString(),
    }).sort({ createdAt: -1 });
    res.status(200).json(addressess);
});
