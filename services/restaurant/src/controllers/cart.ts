import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middlewares/isAuth";
import TryCatch from "../middlewares/trycatch";
import Cart from "../models/Cart";

export const addTocart = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user._id;

  const { restaurantId, itemId } = req.body;

  if (
    !mongoose.Types.ObjectId.isValid(restaurantId) ||
    !mongoose.Types.ObjectId.isValid(itemId)
  ) {
    return res.status(400).json({ message: "Invalid restaurantId or itemId" });
  }

  const cartFromDifferentRestaurant = await Cart.findOne({
    userId,
    restaurantId: { $ne: restaurantId },
  });

  if (cartFromDifferentRestaurant) {
    return res
      .status(400)
      .json({
        message:
          "You can only add items from one restaurant at a time. Please clear your cart before adding items from a different restaurant.",
      });
  }

  const existingCartItem = await Cart.findOneAndUpdate(
    { userId, restaurantId, itemId },
    { $inc: { quantity: 1 }, $setOnInsert: { userId, restaurantId, itemId } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

    return res.status(200).json({
        message: "Item added to cart successfully",
        cart: existingCartItem,
    });
});

export const getCartItems = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user._id;

  const cartItems = await Cart.find({ userId }).populate("itemId").populate("restaurantId");

  let subTotal = 0;
  let cartLength = 0;

  for(const cartItem of cartItems) {
    const item: any = cartItem.itemId;
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

export const increaseCartItemQuantity = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;

  const {itemId} = req.body;

  if(!userId || !itemId) {
    return res.status(400).json({ message: "Invalid Request" });
  }

  const cartItem = await Cart.findOneAndUpdate(
    { userId, itemId },
    { $inc: { quantity: 1 } },
    { new: true }
  );

  if (!cartItem) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  return res.status(200).json({
    message: "Item quantity increased",
    cart: cartItem,
  });
});

export const decreaseCartItemQuantity = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;

  const {itemId} = req.body;

  if(!userId || !itemId) {
    return res.status(400).json({ message: "Invalid Request" });
  }

  const cartItem = await Cart.findOne(
    { userId, itemId }
  );

  if (!cartItem) {
    return res.status(404).json({ message: "Item not found in cart" });
  }

  if(cartItem.quantity === 1) {
    await Cart.deleteOne({ userId, itemId });

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

export const clearCart = TryCatch(async (req: AuthenticatedRequest, res) => {
  const userId = req.user?._id;

  if(!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await Cart.deleteMany({ userId });

  return res.status(200).json({
    message: "Cart cleared successfully",
  });
})