import mongoose, { Schema, Document } from "mongoose";

export interface IAdress extends Document {
  userId: string;
  mobile: number;
  formattedAddress: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    mobile: {
        type: Number,
        required: true,
    },
    formattedAddress: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, { timestamps: true });

AddressSchema.index({location: "2dsphere"});

const Address = mongoose.model<IAdress>("Address", AddressSchema);

export default Address;
