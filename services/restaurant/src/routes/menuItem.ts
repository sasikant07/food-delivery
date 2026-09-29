import express from "express";
import { isAuth, isSeller } from "../middlewares/isAuth";
import { addMenuItem, deletemenuItem, getAllItems, toggleMenuItemAvailability } from "../controllers/menuItem";

const router = express.Router();

router.post("/new", isAuth, isSeller, addMenuItem);
router.get("/all/:id", isAuth, getAllItems);
router.delete("/:id", isAuth, isSeller, deletemenuItem);
router.put("/status/:id", isAuth, isSeller, toggleMenuItemAvailability);

export default router;