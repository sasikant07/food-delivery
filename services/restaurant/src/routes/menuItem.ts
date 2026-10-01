import express from "express";
import { isAuth, isSeller } from "../middlewares/isAuth";
import { addMenuItem, deletemenuItem, getAllItems, toggleMenuItemAvailability } from "../controllers/menuItem";
import uploadFile from "../middlewares/multer";

const router = express.Router();

router.post("/new", isAuth, isSeller, uploadFile, addMenuItem);
router.get("/all/:id", isAuth, getAllItems);
router.delete("/:itemId", isAuth, isSeller, deletemenuItem);
router.put("/status/:itemId", isAuth, isSeller, toggleMenuItemAvailability);

export default router;