import express from "express";
import { isAuth } from "../middlewares/isAuth";
import { addAddress, deleteAddress, getMyAddressess } from "../controllers/Address";

const router = express.Router();

router.post("/new", isAuth, addAddress);
router.get("/all", isAuth, getMyAddressess);
router.delete("/:id", isAuth, deleteAddress);

export default router;