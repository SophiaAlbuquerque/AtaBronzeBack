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

const redis = new Redis(process.env.REDIS_URL, {
  connectTimeout: 10000,
  maxRetriesPerRequest: null
});

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/bling", blingRoutes);

app.get("/health", async (req, res) => {
  let redisStatus = "unavailable";
  let postgresStatus = "unavailable";
  try {
    await prisma.$queryRaw`SELECT 1`;
    postgresStatus = "connected";
  } catch (err) {
    console.error("Erro Postgres:", err);
    postgresStatus = "error";
  }
  try {
    const pong = await Promise.race([
      redis.ping(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Redis timeout")), 3000))
    ]);
    redisStatus = pong === "PONG" ? "connected" : "error";
  } catch (err) {
    console.error("Erro Redis:", err);
    redisStatus = "error";
  }
  res.json({
    status: postgresStatus === "connected" && redisStatus === "connected" ? "ok" : "degraded",
    postgres: postgresStatus,
    redis: redisStatus
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
