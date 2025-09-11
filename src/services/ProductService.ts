import { ProductRepository } from '../repositories/ProductRepository';
import { CreateProductInput, UpdateProductInput, Product } from '../types/product';
import { BlingService } from './BlingService';
import { logger } from '../config/logger';

export class ProductService {
  private productRepository: ProductRepository;
  private blingService: BlingService;

  constructor() {
    this.productRepository = new ProductRepository();
    this.blingService = new BlingService();
  }

  async createProduct(data: CreateProductInput): Promise<Product> {
    // Check if product with blingId already exists
    if (data.blingId) {
      const existingProduct = await this.productRepository.findByBlingId(data.blingId);
      if (existingProduct) {
        throw new Error('Produto já existe com este ID do Bling');
      }
    }

    const product = await this.productRepository.create(data);
    logger.info('Product created', { productId: product.id, name: product.name });

    return product;
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.productRepository.findById(id);
  }

  async updateProduct(id: string, data: UpdateProductInput): Promise<Product> {
    // Check if blingId is being updated and already exists
    if (data.blingId) {
      const existingProduct = await this.productRepository.findByBlingId(data.blingId);
      if (existingProduct && existingProduct.id !== id) {
        throw new Error('ID do Bling já está em uso');
      }
    }

    const product = await this.productRepository.update(id, data);
    logger.info('Product updated', { productId: product.id, name: product.name });

    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
    logger.info('Product deleted', { productId: id });
  }

  async getProducts(page: number = 1, limit: number = 10): Promise<Product[]> {
    const skip = (page - 1) * limit;
    return this.productRepository.findMany(skip, limit);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.productRepository.updateStock(id, quantity);
    logger.info('Product stock updated', { 
      productId: product.id, 
      name: product.name, 
      newStock: product.stock 
    });

    return product;
  }

  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    return this.productRepository.findLowStock(threshold);
  }

  async getProductByBlingId(blingId: string): Promise<Product | null> {
    return this.productRepository.findByBlingId(blingId);
  }

  async syncBlingProducts(): Promise<{ synced: number; errors: number; total: number }> {
    try {
      logger.info('Starting Bling products sync');
      
      // Get products from Bling
      const blingProducts = await this.blingService.getProducts();
      let synced = 0;
      let errors = 0;

      for (const blingProduct of blingProducts) {
        try {
          // Check if product already exists
          const existingProduct = await this.productRepository.findByBlingId(blingProduct.id);
          
          if (existingProduct) {
            // Update existing product
            await this.productRepository.update(existingProduct.id, {
              name: blingProduct.name,
              description: blingProduct.description,
              price: blingProduct.price,
              stock: blingProduct.stock,
            });
            logger.debug('Updated product from Bling', { 
              blingId: blingProduct.id, 
              name: blingProduct.name 
            });
          } else {
            // Create new product
            await this.productRepository.create({
              name: blingProduct.name,
              description: blingProduct.description || '',
              price: blingProduct.price,
              stock: blingProduct.stock,
              blingId: blingProduct.id,
            });
            logger.debug('Created product from Bling', { 
              blingId: blingProduct.id, 
              name: blingProduct.name 
            });
          }
          
          synced++;
        } catch (error: any) {
          logger.error('Error syncing individual product', { 
            blingId: blingProduct.id, 
            error: error.message 
          });
          errors++;
        }
      }

      logger.info('Bling products sync completed', { 
        total: blingProducts.length, 
        synced, 
        errors 
      });

      return { synced, errors, total: blingProducts.length };
    } catch (error: any) {
      logger.error('Error in Bling products sync', { error: error.message });
      throw new Error('Falha na sincronização com Bling');
    }
  }
}
