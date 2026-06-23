import TryCatch from "../middlewares/trycatch.js";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
export const loginUser = TryCatch(async (req, res) => {
    const { email, name, picture } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name,
            email,
            image: picture,
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    res.status(200).json({ message: "User logged in successfully", token, user });
});
const allowedRoles = ["customer", "rider", "seller"];
export const addUserRole = TryCatch(async (req, res) => {
    if (!req.user?._id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const { role } = req.body;
    if (!allowedRoles.includes(role)) {
        res.status(400).json({ message: "Invalid role" });
        return;
    }
    const user = await User.findByIdAndUpdate(req.user._id, { role }, { new: true });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    const token = jwt.sign({ user }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
    res.status(200).json({ message: "User role updated successfully", token, user });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json({ message: "User profile fetched successfully", user });
});
