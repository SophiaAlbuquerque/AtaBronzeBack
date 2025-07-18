import { calcularFrete } from "../services/freteService.js";

export async function calcularFreteController(req, res) {
  const { origemCep, destinoCep, pesoKg } = req.body;

  if (!origemCep || !destinoCep || !pesoKg) {
    return res.status(400).json({ error: "origemCep, destinoCep e pesoKg são obrigatórios." });
  }

  try {
    const resultado = await calcularFrete(origemCep, destinoCep, Number(pesoKg));
    res.json(resultado);
  } catch (error) {
    console.error("Erro no cálculo de frete:", error);
    res.status(500).json({ error: "Erro ao calcular frete." });
  }
}
