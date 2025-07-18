// Exemplo básico e mock — normalmente você chamaria API real
export async function calcularFrete(origemCep, destinoCep, pesoKg) {
  // Simular cálculo (tarifa fixa + peso)
  const tarifaBase = 10; // R$10 fixo
  const tarifaPeso = 5 * pesoKg; // R$5 por kg

  const valorFrete = tarifaBase + tarifaPeso;

  // Prazo fixo
  const prazoEntregaDias = 5;

  return {
    valorFrete: valorFrete.toFixed(2),
    prazoEntregaDias,
  };
}
