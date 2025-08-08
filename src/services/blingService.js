// src/services/loggiService.js
const loggiClient = require('../utils/loggiClient');

async function calcularFrete(dadosFrete) {
  try {
    // Ajuste o payload conforme a documentação da Loggi
    const response = await loggiClient.post('/quote', dadosFrete);
    return response.data;
  } catch (error) {
    console.error('Erro ao calcular frete Loggi:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = {
  calcularFrete,
};
