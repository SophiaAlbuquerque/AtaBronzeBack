// src/utils/blingClient.js
const axios = require('axios');

const blingClient = axios.create({
  baseURL: 'https://www.bling.com.br/Api/v2', // Endpoint oficial da Bling
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = blingClient;
