import mongoose, { Schema, Document } from "mongoose";

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  restaurantId: mongoose.Types.ObjectId;
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

const CartSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
      index: true,
    },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true },
);

//prevent duplicate cart items for the same user, restaurant, and item combination
CartSchema.index({ userId: 1, restaurantId: 1, itemId: 1 }, { unique: true });

const Cart = mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
