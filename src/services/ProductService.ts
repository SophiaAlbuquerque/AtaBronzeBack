import { ProductRepository } from '../repositories/ProductRepository';
import { CreateProductInput, UpdateProductInput, Product } from '../types/product';
import { logger } from '../config/logger';

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
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
}
