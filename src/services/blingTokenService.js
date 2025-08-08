import prisma from "../prisma/client.js";

export async function saveOrUpdateToken(userId, { accessToken, refreshToken, expiresAt }) {
  // Atualiza se existir, cria se não
  return prisma.blingToken.upsert({
    where: { userId },
    update: {
      accessToken,
      refreshToken,
      expiresAt,
      updatedAt: new Date(),
    },
    create: {
      userId,
      accessToken,
      refreshToken,
      expiresAt,
    },
  });
}

export async function getTokenByUserId(userId) {
  return prisma.blingToken.findUnique({
    where: { userId },
  });
}

export async function deleteToken(userId) {
  return prisma.blingToken.delete({
    where: { userId },
  });
}
