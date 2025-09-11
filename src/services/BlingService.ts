import axios from 'axios';
import { config } from '../config';
import { logger } from '../config/logger';

export interface BlingProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
}

export interface BlingOAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export class BlingService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private baseUrl: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor() {
    this.clientId = config.apis.bling.clientId;
    this.clientSecret = config.apis.bling.clientSecret;
    this.redirectUri = config.apis.bling.redirectUri;
    this.baseUrl = config.apis.bling.baseUrl;
  }

  /**
   * Get OAuth authorization URL
   */
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      state: 'random_state_string', // Should be random in production
      scope: 'produtos'
    });

    return `https://www.bling.com.br/Api/v3/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async getAccessToken(authCode: string): Promise<BlingOAuthToken> {
    try {
      const response = await axios.post('https://www.bling.com.br/Api/v3/oauth/token', {
        grant_type: 'authorization_code',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code: authCode
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const tokenData = response.data;
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;
      this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000));

      logger.info('Bling OAuth token obtained successfully');
      return tokenData;
    } catch (error: any) {
      logger.error('Error getting Bling OAuth token', {
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error('Falha na autenticação OAuth com Bling');
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(): Promise<BlingOAuthToken> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await axios.post('https://www.bling.com.br/Api/v3/oauth/token', {
        grant_type: 'refresh_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: this.refreshToken
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const tokenData = response.data;
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;
      this.tokenExpiry = new Date(Date.now() + (tokenData.expires_in * 1000));

      logger.info('Bling OAuth token refreshed successfully');
      return tokenData;
    } catch (error: any) {
      logger.error('Error refreshing Bling OAuth token', {
        error: error.message,
        status: error.response?.status
      });
      throw new Error('Falha ao renovar token OAuth do Bling');
    }
  }

  /**
   * Check if token is valid and refresh if needed
   */
  private async ensureValidToken(): Promise<void> {
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }

    // Check if token is expired (with 5 minute buffer)
    if (this.tokenExpiry && this.tokenExpiry.getTime() < Date.now() + 300000) {
      logger.info('Bling token is expired, refreshing...');
      await this.refreshAccessToken();
    }
  }

  /**
   * Get headers for authenticated requests
   */
  private async getAuthHeaders() {
    await this.ensureValidToken();
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  /**
   * Get all products from Bling
   */
  async getProducts(): Promise<BlingProduct[]> {
    try {
      // Check if OAuth is configured
      if (!this.accessToken) {
        logger.warn('Bling OAuth not configured, returning mock data');
        return this.getMockProducts();
      }

      const response = await axios.get(`${this.baseUrl}/produtos`, {
        headers: await this.getAuthHeaders(),
        params: {
          limite: 100,
          pagina: 1
        }
      });

      const products = response.data.data?.map((product: any) => ({
        id: product.id,
        name: product.nome,
        description: product.descricao,
        price: parseFloat(product.preco) || 0,
        stock: parseInt(product.estoqueAtual) || 0,
      })) || [];

      logger.info(`Found ${products.length} products in Bling`);
      return products;
    } catch (error: any) {
      logger.error('Error fetching products from Bling', {
        error: error.message,
        status: error.response?.status,
      });
      
      // Fallback to mock data
      return this.getMockProducts();
    }
  }

  /**
   * Get a specific product from Bling
   */
  async getProductById(id: string): Promise<BlingProduct | null> {
    try {
      // Check if OAuth is configured
      if (!this.accessToken) {
        logger.warn('Bling OAuth not configured, returning mock data');
        const mockProducts = this.getMockProducts();
        return mockProducts.find(p => p.id === id) || null;
      }

      const response = await axios.get(`${this.baseUrl}/produtos/${id}`, {
        headers: await this.getAuthHeaders(),
      });

      const product = response.data.data;
      if (!product) {
        return null;
      }

      return {
        id: product.id,
        name: product.nome,
        description: product.descricao,
        price: parseFloat(product.preco) || 0,
        stock: parseInt(product.estoqueAtual) || 0,
      };
    } catch (error: any) {
      logger.error('Error fetching product from Bling', {
        error: error.message,
        productId: id,
        status: error.response?.status,
      });
      
      // Fallback to mock data
      const mockProducts = this.getMockProducts();
      return mockProducts.find(p => p.id === id) || null;
    }
  }

  /**
   * Sync products from Bling
   */
  async syncProducts(): Promise<BlingProduct[]> {
    logger.info('Starting Bling product sync');
    const products = await this.getProducts();
    logger.info(`Synced ${products.length} products from Bling`);
    return products;
  }

  /**
   * Get mock products for fallback
   */
  private getMockProducts(): BlingProduct[] {
    return [
      {
        id: 'mock-1',
        name: 'Produto Mock 1',
        description: 'Descrição do produto mock 1',
        price: 29.99,
        stock: 10,
      },
      {
        id: 'mock-2',
        name: 'Produto Mock 2',
        description: 'Descrição do produto mock 2',
        price: 49.99,
        stock: 5,
      },
    ];
  }

  /**
   * Check if service is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken && (!this.tokenExpiry || this.tokenExpiry.getTime() > Date.now());
  }

  /**
   * Manually set tokens (for testing or when tokens are stored)
   */
  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpiry = new Date(Date.now() + (expiresIn * 1000));
  }
}
