import prisma from "../prisma/client.js";
import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios." });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Usuário ou senha inválidos." });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Usuário ou senha inválidos." });

    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ message: "Login realizado com sucesso.", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
