import express from "express";
import { createFavorite, getFavorites, deleteFavorite } from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/", createFavorite);
router.get("/:user_id", getFavorites);
router.delete("/:user_id/:product_id", deleteFavorite);

export default router;
