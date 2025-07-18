import express from "express";
import { getStock } from "../controllers/estoqueController.js";

const router = express.Router();

router.get("/:sku", getStock);

export default router;
