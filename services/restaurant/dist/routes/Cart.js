"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_1 = require("../controllers/cart");
const isAuth_1 = require("../middlewares/isAuth");
const router = express_1.default.Router();
router.post("/add", isAuth_1.isAuth, cart_1.addTocart);
router.get("/all", isAuth_1.isAuth, cart_1.getCartItems);
router.put("/inc", isAuth_1.isAuth, cart_1.increaseCartItemQuantity);
router.put("/dec", isAuth_1.isAuth, cart_1.decreaseCartItemQuantity);
router.delete("/clear", isAuth_1.isAuth, cart_1.clearCart);
exports.default = router;
