"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuth_1 = require("../middlewares/isAuth");
const menuItem_1 = require("../controllers/menuItem");
const multer_1 = __importDefault(require("../middlewares/multer"));
const router = express_1.default.Router();
router.post("/new", isAuth_1.isAuth, isAuth_1.isSeller, multer_1.default, menuItem_1.addMenuItem);
router.get("/all/:id", isAuth_1.isAuth, menuItem_1.getAllItems);
router.delete("/:id", isAuth_1.isAuth, isAuth_1.isSeller, menuItem_1.deletemenuItem);
router.put("/status/:id", isAuth_1.isAuth, isAuth_1.isSeller, menuItem_1.toggleMenuItemAvailability);
exports.default = router;
