import axios from "axios";
import qs from "qs";
import prisma from "../prisma/client.js";

const TOKEN_URL = "https://www.bling.com.br/Api/v3/oauth/token";

// Obter token pela primeira vez
export async function getBlingAccessToken(code) {
  const data = {
    grant_type: "authorization_code",
    client_id: process.env.BLING_CLIENT_ID,
    client_secret: process.env.BLING_CLIENT_SECRET,
    code,
    redirect_uri: process.env.BLING_REDIRECT_URI,
  };
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const response = await axios.post(TOKEN_URL, qs.stringify(data), { headers });
  return response.data;
}

// Refresh do token
export async function refreshBlingToken(userId, refreshToken) {
  const data = {
    grant_type: "refresh_token",
    client_id: process.env.BLING_CLIENT_ID,
    client_secret: process.env.BLING_CLIENT_SECRET,
    refresh_token: refreshToken,
  };
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };
  const response = await axios.post(TOKEN_URL, qs.stringify(data), { headers });

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + response.data.expires_in);

  await prisma.blingToken.update({
    where: { userId },
    data: {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token || refreshToken,
      expiresAt,
    },
  });

  return response.data.access_token;
}
