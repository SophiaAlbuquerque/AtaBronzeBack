import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Bling Backend está rodando!");
});

// Exemplo de rota para listar produtos
app.get("/products", async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// Exemplo de rota para adicionar favorito
app.post("/users/:userId/favorites", async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  try {
    const favorite = await prisma.favorite.create({
      data: {
        userId: parseInt(userId),
        productId,
      },
    });
    res.json(favorite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});