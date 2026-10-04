import Express from "express";
import { addTocart, clearCart, decreaseCartItemQuantity, getCartItems, increaseCartItemQuantity } from "../controllers/cart";
import { isAuth } from "../middlewares/isAuth";

const router = Express.Router();

router.post("/add", isAuth, addTocart);
router.get("/all", isAuth, getCartItems);
router.put("/inc", isAuth, increaseCartItemQuantity);
router.put("/dec", isAuth, decreaseCartItemQuantity);
router.delete("/clear", isAuth, clearCart);

export default router;