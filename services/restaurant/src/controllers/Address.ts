import mongoose from "mongoose";
import { AuthenticatedRequest } from "../middlewares/isAuth";
import TryCatch from "../middlewares/trycatch";
import Address from "../models/Address";

export const addAddress = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { mobile, formattedAddress, latitude, longitude } = req.body;

  if (
    !mobile ||
    !formattedAddress ||
    latitude === undefined ||
    longitude === undefined
  ) {
    return res.status(400).json({
      message: "Please provide all the details",
    });
  }

  const newAddress = await Address.create({
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

export const deleteAddress = TryCatch(
  async (req: AuthenticatedRequest, res) => {
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

    const address = await Address.findOne({
      _id: id,
      userId: user._id.toString(),
    });

    if (!addAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await address?.deleteOne();

    return res.status(200).json({
      message: "Address deleted successfully!",
    });
  },
);

export const getMyAddressess = TryCatch(
  async (req: AuthenticatedRequest, res) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const addressess = await Address.find({
      userId: user._id.toString(),
    }).sort({ createdAt: -1 });

    res.status(200).json(addressess);
  },
);
