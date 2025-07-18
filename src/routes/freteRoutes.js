import express from "express";
import { calcularFreteController } from "../controllers/freteController.js";

const router = express.Router();

router.post("/calcular", calcularFreteController);

export default router;
