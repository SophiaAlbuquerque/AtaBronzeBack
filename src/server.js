import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import blingRoutes from "./routes/blingRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/bling", blingRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

import express from "express";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prisma = new PrismaClient();

// Redis (pega da variável de ambiente)
const redis = new Redis(process.env.REDIS_URL || {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD
});

app.get("/health", async (req, res) => {
  try {
    // Teste Postgres
    await prisma.$queryRaw`SELECT 1`;

    // Teste Redis
    const pong = await redis.ping();

    res.json({
      status: "ok",
      postgres: "connected",
      redis: pong === "PONG" ? "connected" : "error"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
