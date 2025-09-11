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

export class BlingService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.apis.bling.apiKey;
    this.baseUrl = config.apis.bling.baseUrl;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async getProducts(): Promise<BlingProduct[]> {
    try {
      // Mock implementation - replace with actual API call
      logger.info('Fetching products from Bling API (MOCK)');
      
      // Simulated API response
      const mockProducts: BlingProduct[] = [
        {
          id: 'bling_1',
          name: 'Produto Mock 1',
          description: 'Descrição do produto mock 1',
          price: 99.99,
          stock: 50,
        },
        {
          id: 'bling_2',
          name: 'Produto Mock 2',
          description: 'Descrição do produto mock 2',
          price: 149.99,
          stock: 25,
        },
      ];

      return mockProducts;

      // Actual implementation would be:
      // const response = await axios.get(`${this.baseUrl}/products`, {
      //   headers: this.getHeaders(),
      // });
      // return response.data.data;
    } catch (error) {
      logger.error('Error fetching products from Bling', { error });
      throw new Error('Erro ao buscar produtos do Bling');
    }
  }

  async getProductById(blingId: string): Promise<BlingProduct | null> {
    try {
      logger.info('Fetching product from Bling API (MOCK)', { blingId });
      
      // Mock implementation
      if (blingId === 'bling_1') {
        return {
          id: 'bling_1',
          name: 'Produto Mock 1',
          description: 'Descrição do produto mock 1',
          price: 99.99,
          stock: 50,
        };
      }

      return null;

      // Actual implementation would be:
      // const response = await axios.get(`${this.baseUrl}/products/${blingId}`, {
      //   headers: this.getHeaders(),
      // });
      // return response.data.data;
    } catch (error) {
      logger.error('Error fetching product from Bling', { error, blingId });
      throw new Error('Erro ao buscar produto do Bling');
    }
  }

  async syncProducts(): Promise<BlingProduct[]> {
    try {
      logger.info('Starting product sync with Bling');
      const products = await this.getProducts();
      logger.info('Product sync completed', { count: products.length });
      return products;
    } catch (error) {
      logger.error('Error syncing products with Bling', { error });
      throw error;
    }
  }
}
