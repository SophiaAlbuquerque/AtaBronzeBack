import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { productValidation } from '../utils/validation';
import { logger } from '../config/logger';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = productValidation.create.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const product = await this.productService.createProduct(value);
      res.status(201).json({
        message: 'Produto criado com sucesso',
        product,
      });
    } catch (error: any) {
      logger.error('Error creating product', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const products = await this.productService.getProducts(page, limit);
      res.json({ products });
    } catch (error: any) {
      logger.error('Error getting products', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.productService.getProductById(id);
      
      if (!product) {
        res.status(404).json({ error: 'Produto não encontrado' });
        return;
      }

      res.json({ product });
    } catch (error: any) {
      logger.error('Error getting product by id', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = productValidation.update.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const { id } = req.params;
      const product = await this.productService.updateProduct(id, value);
      
      res.json({
        message: 'Produto atualizado com sucesso',
        product,
      });
    } catch (error: any) {
      logger.error('Error updating product', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.productService.deleteProduct(id);
      res.json({ message: 'Produto removido com sucesso' });
    } catch (error: any) {
      logger.error('Error deleting product', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || typeof quantity !== 'number') {
        res.status(400).json({ error: 'Quantidade é obrigatória e deve ser um número' });
        return;
      }

      const product = await this.productService.updateStock(id, quantity);
      res.json({
        message: 'Estoque atualizado com sucesso',
        product,
      });
    } catch (error: any) {
      logger.error('Error updating product stock', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getLowStockProducts(req: Request, res: Response): Promise<void> {
    try {
      const threshold = parseInt(req.query.threshold as string) || 10;
      const products = await this.productService.getLowStockProducts(threshold);
      res.json({ products });
    } catch (error: any) {
      logger.error('Error getting low stock products', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
