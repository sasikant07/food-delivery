import { ObjectId } from "mongodb";
import {
  getRestaurantCollection,
  getRiderCollection,
} from "../util/collection.js";
import TryCatch from "../middlewares/trycatch.js";

export const getPendingRestaurants = TryCatch(async (req, res) => {
  const restaurantCollection = await (await getRestaurantCollection())
    .find({ isVerified: false })
    .toArray();

  res.status(200).json({
    count: restaurantCollection.length,
    restaurants: restaurantCollection,
  });
});

export const getPendingRiders = TryCatch(async (req, res) => {
  const riderCollection = await (await getRiderCollection())
    .find({ isVerified: false })
    .toArray();

  res.status(200).json({
    count: riderCollection.length,
    riders: riderCollection,
  });
});

export const verifyRestaurant = TryCatch(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string" || !ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid restaurant id" });
    return;
  }

  const restaurantCollection = await getRestaurantCollection();
  const result = await restaurantCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isVerified: true, updatedAt: new Date() } },
  );

  if (result.matchedCount === 0) {
    res.status(404).json({ message: "Restaurant not found" });
    return;
  }

  res.status(200).json({ message: "Restaurant verified successfully" });
});

export const verifyRider = TryCatch(async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string" || !ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid rider id" });
    return;
  }

  const riderCollection = await getRiderCollection();
  const result = await riderCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isVerified: true, updatedAt: new Date() } },
  );

  if (result.matchedCount === 0) {
    res.status(404).json({ message: "Rider not found" });
    return;
  }

  res.status(200).json({ message: "Rider verified successfully" });
});
