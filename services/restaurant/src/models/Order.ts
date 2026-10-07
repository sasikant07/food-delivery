import mongoose, { Document, Schema } from "mongoose";

export interface IOrder extends Document {
  userId: string;
  restaurantId: string;
  restaurantName: string;
  riderId?: string | null;
  riderPhone: number | null;
  riderName: string | null;
  distance: number;
  riderAmount: number;
  items: {
    itemId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  subTotal: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  addressId: string;
  deliveryAddress: {
    formattedAddress: string;
    mobile: number;
    latitude: number;
    longitude: number;
  };
  status:
    | "placed"
    | "accepted"
    | "preparing"
    | "ready_for_rider"
    | "rider_assigned"
    | "picked_up"
    | "delivered"
    | "cancelled";

  paymentMethod: "razorpay" | "stripe";
  paymentStatus: "pending" | "paid" | "failed";
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    restaurantId: {
      type: String,
      required: true,
    },
    restaurantName: {
      type: String,
      required: true,
    },
    riderId: {
      type: String,
      default: null,
    },
    riderPhone: {
      type: Number,
      default: null,
    },
    riderName: {
      type: String,
      default: null,
    },
    distance: {
      type: Number,
      required: true,
    },
    riderAmount: {
      type: String,
      required: true,
    },
    items: [
      {
        itemId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    subTotal: Number,
    deliveryFee: Number,
    platformFee: Number,
    totalAmount: Number,
    addressId: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      formattedAddress: {
        tyep: String,
        required: true,
      },
      mobile: {
        type: Number,
        required: true,
      },
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: [
        "placed",
        "accepted",
        "preparing",
        "ready_for_rider",
        "rider_assigned",
        "picked_up",
        "delivered",
        "cancelled",
      ],
      default: "placed",
    },
    paymentMethod: {
      type: String,
      enum: ["razorpay", "stripe"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pendding",
    },
    expiresAt: {
      type: Date,
      index: { expireAfterSeconds: 0 },
    },
  },
  { timestamps: true },
);

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
