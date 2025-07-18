import { getProductStock } from "../services/blingService.js";

export async function getStock(req, res) {
  const { sku } = req.params;

  if (!sku) {
    return res.status(400).json({ error: "SKU do produto é obrigatório." });
  }

  try {
    const estoque = await getProductStock(sku);

    if (estoque === null) {
      return res.status(404).json({ error: "Produto não encontrado no Bling." });
    }

    res.json({ sku, estoque });
  } catch {
    res.status(500).json({ error: "Erro ao consultar estoque." });
  }
}
