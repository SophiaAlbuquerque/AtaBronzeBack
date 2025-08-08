import express from "express";
import axios from "axios";
import prisma from "../prisma/client.js";
import { getBlingAccessToken, refreshBlingToken } from "../services/blingService.js";
import { saveOrUpdateToken, getTokenByUserId } from "../services/blingTokenService.js";
import { getUserIdByState } from "../utils/stateStore.js";

const router = express.Router();

router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state)
    return res.status(400).json({ error: "Código ou state não fornecido." });

  const userId = await getUserIdByState(state);
  if (!userId)
    return res.status(400).json({ error: "State inválido ou expirado." });

  try {
    const tokenData = await getBlingAccessToken(code);

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

    await saveOrUpdateToken(userId, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt,
    });

    res.json({ message: "Token salvo com sucesso", tokenData });
  } catch (err) {
    res.status(500).json({ error: "Erro ao obter token do Bling", details: err.message });
  }
});

router.get("/produtos", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "UserId é obrigatório." });

  try {
    let tokenRecord = await getTokenByUserId(userId);
    if (!tokenRecord) return res.status(401).json({ error: "Token Bling não encontrado para usuário." });

    if (new Date() >= tokenRecord.expiresAt && tokenRecord.refreshToken) {
      const newAccessToken = await refreshBlingToken(userId, tokenRecord.refreshToken);
      tokenRecord.accessToken = newAccessToken;
    }

    const response = await axios.get("https://www.bling.com.br/Api/v3/produtos", {
      headers: {
        Authorization: `Bearer ${tokenRecord.accessToken}`,
      },
    });

    for (const item of response.data.data) {
      const blingId = item.id;
      const name = item.nome;
      const price = parseFloat(item.preco);
      const imageUrl = item.imagem?.link || null;

      await prisma.product.upsert({
        where: { blingId },
        update: { name, price, imageUrl },
        create: { blingId, name, price, imageUrl },
      });
    }

    res.json({ message: "Produtos importados com sucesso", produtos: response.data.data });
  } catch (err) {
    res.status(500).json({ error: "Erro ao importar produtos", details: err.message });
  }
});

export default router;
