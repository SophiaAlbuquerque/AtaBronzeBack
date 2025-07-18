import { criarPagamento } from "../services/pagamentoService.js";

export async function processarPagamento(req, res) {
  const { amount, currency, paymentMethodId } = req.body;

  if (!amount || !currency || !paymentMethodId) {
    return res.status(400).json({ error: "amount, currency e paymentMethodId são obrigatórios." });
  }

  try {
    const pagamento = await criarPagamento(amount, currency, paymentMethodId);
    res.json({ success: true, pagamento });
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
    res.status(500).json({ error: "Erro ao processar pagamento." });
  }
}
