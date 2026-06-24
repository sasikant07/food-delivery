import axios from "axios";
import { oauth2Client } from "../config/googleConfig.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import TryCatch from "../middlewares/trycatch.js";
import User from "../model/User.js";
import jwt from "jsonwebtoken";

export const loginUser = TryCatch(async (req, res) => {
  const { code } = req.body;

  if (!code) {
    res.status(400).json({ message: "Authorization code is required" });
    return;
  }

  const googleResponse = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(googleResponse.tokens);

  const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`);
  
  const { email, name, picture } = userResponse.data;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      name,
      email,
      image: picture,
    });
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
    expiresIn: "15d",
  });

  res.status(200).json({ message: "User logged in successfully", token, user });
});

const allowedRoles = ["customer", "rider", "seller"] as const;
type Role = (typeof allowedRoles)[number];

export const addUserRole = TryCatch(async (req: AuthenticatedRequest, res) => {
    if (!req.user?._id) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    const { role } = req.body as { role: Role };

    if (!allowedRoles.includes(role)) {
        res.status(400).json({ message: "Invalid role" });
        return;
    }

    const user = await User.findByIdAndUpdate(req.user._id, { role }, { new: true});

    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET as string, {
        expiresIn: "15d",
    });

    res.status(200).json({ message: "User role updated successfully", token, user });
})

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
    const user = req.user;
    res.json({ message: "User profile fetched successfully", user });
})