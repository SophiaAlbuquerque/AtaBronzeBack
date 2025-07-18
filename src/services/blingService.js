import axios from "axios";

const BLING_API_KEY = process.env.BLING_API_KEY; // configure sua API key no .env
const BLING_BASE_URL = "https://bling.com.br/Api/v2";

export async function getProductStock(sku) {
  try {
    const url = `${BLING_BASE_URL}/produto/json/?apikey=${BLING_API_KEY}&filters=code[${sku}]`;
    const response = await axios.get(url);

    if (response.data.retorno?.produtos?.length > 0) {
      const produto = response.data.retorno.produtos[0].produto;
      const estoque = produto.estoque;
      return estoque;
    }
    return null;
  } catch (error) {
    console.error("Erro ao consultar estoque no Bling:", error.message);
    throw error;
  }
}
