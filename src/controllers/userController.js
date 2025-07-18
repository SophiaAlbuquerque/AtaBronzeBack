import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, passwordHash } });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Este email já está em uso." });
    }
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
