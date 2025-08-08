import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import blingRoutes from "./routes/blingRoutes.js";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL, { connectTimeout: 10000, maxRetriesPerRequest: 5 });

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/bling", blingRoutes);

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
