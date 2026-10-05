"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const isAuth_1 = require("../middlewares/isAuth");
const Address_1 = require("../controllers/Address");
const router = express_1.default.Router();
router.post("/new", isAuth_1.isAuth, Address_1.addAddress);
router.get("/all", isAuth_1.isAuth, Address_1.getMyAddressess);
router.delete("/:id", isAuth_1.isAuth, Address_1.deleteAddress);
exports.default = router;
