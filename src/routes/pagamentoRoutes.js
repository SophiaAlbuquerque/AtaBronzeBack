import express from "express";
import { processarPagamento } from "../controllers/pagamentoController.js";

const router = express.Router();

router.post("/processar", processarPagamento);

export default router;
