import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/atabronze_db?schema=public',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key-for-development',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  apis: {
    bling: {
      apiKey: process.env.BLING_API_KEY || '',
      baseUrl: process.env.BLING_API_URL || 'https://api.bling.com.br/Api/v3',
      clientId: process.env.BLING_CLIENT_ID || '',
      clientSecret: process.env.BLING_CLIENT_SECRET || '',
      redirectUri: process.env.BLING_REDIRECT_URI || '',
    },
    asaas: {
      apiKey: process.env.ASAAS_API_KEY || '',
      baseUrl: process.env.ASAAS_API_URL || 'https://api.asaas.com/v3',
      sandbox: process.env.ASAAS_SANDBOX === 'true',
    },
    correios: {
      baseUrl: process.env.CORREIOS_API_URL || 'https://cep.correios.com.br/api/v2',
    },
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
