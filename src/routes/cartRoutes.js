import express from "express";
import { addItemToCart, getCartItems, deleteCartItem } from "../controllers/cartController.js";

const router = express.Router();

router.post("/", addItemToCart);
router.get("/:user_id", getCartItems);
router.delete("/:id", deleteCartItem);

export default router;
