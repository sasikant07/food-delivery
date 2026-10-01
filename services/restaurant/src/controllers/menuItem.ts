import axios from "axios";
import getBuffer from "../config/datauri";
import { AuthenticatedRequest } from "../middlewares/isAuth";
import TryCatch from "../middlewares/trycatch";
import Restaurant from "../models/Restaurant";
import MenuItem from "../models/MenuItems";

export const addMenuItem = TryCatch(async (req: AuthenticatedRequest, res) => {
    if(!req.user) {
        return res.status(401).json({
            message: "Please login to continue"
        })
    }

    const restaurant = await Restaurant.findOne({
        ownerId: req.user._id
    });

    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found"
        })
    }

    const {name, description, price} = req.body;

    if (!name || !price) {
        return res.status(400).json({
            message: "Name and Price are required"
        })
    }

    const file = req.file;

    if (!file) {
        return res.status(400).json({
            message: "Please upload image"
        });
    }

    const fileBuffer = getBuffer(file);

    if (!fileBuffer?.content) {
        return res.status(500).json({
            message: "Failed to create file buffer"
        });
    }

    const {data: uploadResult} = await axios.post(`${process.env.UTILS_SERVICE}/api/upload`, {
        buffer: fileBuffer.content,
    });

    const item = await MenuItem.create({
        restaurantId: restaurant._id,
        name,
        description,
        price,
        image: uploadResult.url
    });

    return res.status(201).json({
        message: "Item added successfully",
        item
    })
});

export const getAllItems = TryCatch(async (req: AuthenticatedRequest, res) => {
    const {id} = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Id is required"
        });
    }

    const items = await MenuItem.find({restaurantId: id});

    return res.status(200).json(items);
});

export const deletemenuItem = TryCatch(async(req: AuthenticatedRequest, res) => {
    if(!req.user) {
        return res.status(401).json({
            message: "Please login to continue"
        })
    }

    const {itemId} = req.params;

    if (!itemId) {
        return res.status(400).json({
            message: "ItemId is required"
        });
    }

    const item = await MenuItem.findById(itemId);

    if (!item) {
        return res.status(404).json({
            message: "Item not found"
        })
    }

    const restaurant = await Restaurant.findOne({
        _id: item.restaurantId,
        ownerId: req.user._id
    })

    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found"
        })
    }

    await item.deleteOne();

    res.status(200).json({
        message: "Menu item deleted successfully"
    })
});

export const toggleMenuItemAvailability = TryCatch(async(req: AuthenticatedRequest, res) => {
    if(!req.user) {
        return res.status(401).json({
            message: "Please login to continue"
        })
    }

    const {itemId} = req.params;

    if (!itemId) {
        return res.status(400).json({
            message: "ItemId is required"
        });
    }

    const item = await MenuItem.findById(itemId);

    if (!item) {
        return res.status(404).json({
            message: "Item not found"
        })
    }

    const restaurant = await Restaurant.findOne({
        _id: item.restaurantId,
        ownerId: req.user._id
    })

    if (!restaurant) {
        return res.status(404).json({
            message: "Restaurant not found"
        })
    }

    item.isAvailable = !item.isAvailable;

    await item.save();

    res.status(200).json({
        message: `Item marked as ${item.isAvailable ? "available" : "unavailable"}`,
        item
    })
});