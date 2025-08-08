import crypto from "crypto";
import bcrypt from "bcrypt";
import prisma from "../prisma/client.js";
import { storeState } from "../utils/stateStore.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email e senha são obrigatórios." });

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Usuário ou senha inválidos." });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Usuário ou senha inválidos." });

    const state = crypto.randomUUID();
    await storeState(state, user.id);

    const authUrl = `https://www.bling.com.br/Api/v3/oauth/authorize?response_type=code&client_id=${process.env.BLING_CLIENT_ID}&redirect_uri=${process.env.BLING_REDIRECT_URI}&state=${state}`;

    res.json({
      message: "Login realizado. Redirecione o usuário para autorização no Bling.",
      authUrl,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};
