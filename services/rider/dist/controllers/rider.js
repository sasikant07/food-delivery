import axios from "axios";
import getBuffer from "../config/datauri.js";
import TryCatch from "../middlewares/trycatch.js";
import Rider from "../model/Rider.js";
export const addRiderProfile = TryCatch(async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role !== "rider") {
        return res
            .status(403)
            .json({ message: "Only riders can create rider profile" });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: "Rider image is required" });
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer?.content) {
        return res
            .status(500)
            .json({ message: "Failed to generate image buffer" });
    }
    const { data: uploadResult } = await axios.post(`${process.env.UTILS_SERVICE}/api/upload`, {
        buffer: fileBuffer.content,
    });
    const { phoneNumber, aadharNumber, drivingLicenseNumber, latitude, longitude, } = req.body;
    if (!phoneNumber ||
        !aadharNumber ||
        !drivingLicenseNumber ||
        latitude === undefined ||
        longitude === undefined) {
        return res.status(400).json({
            message: "All fields are required",
        });
    }
    const existingProfile = await Rider.findOne({
        userId: user._id,
    });
    if (existingProfile) {
        return res.status(400).json({
            message: "rider profile already exists",
        });
    }
    const riderProfile = await Rider.create({
        userId: user._id,
        picture: uploadResult.url,
        phoneNumber,
        aadharNumber,
        drivingLicenseNumber,
        location: {
            type: "Point",
            coordinates: [longitude, latitude],
        },
        isAvailable: false,
        isVerified: false,
    });
    return res.status(201).json({
        message: "Rider profile created successfully",
        riderProfile,
    });
});
