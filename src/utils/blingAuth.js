import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_URL = "https://www.bling.com.br/Api/v3/oauth/token";

let accessToken = null;

export async function getBlingAccessToken(code) {
  try {
    const data = {
      grant_type: "authorization_code",
      client_id: process.env.BLING_CLIENT_ID,
      client_secret: process.env.BLING_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.BLING_REDIRECT_URI,
    };

    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    const response = await axios.post(TOKEN_URL, qs.stringify(data), { headers });

    accessToken = response.data.access_token;

    return response.data;
  } catch (error) {
    console.error("Erro ao obter token:", error.response?.data || error.message);
    throw error;
  }
}

export function getStoredToken() {
  if (!accessToken) {
    throw new Error("Token ainda não foi obtido");
  }
  return accessToken;
}
