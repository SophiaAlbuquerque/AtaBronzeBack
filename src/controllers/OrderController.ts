import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { orderValidation } from '../utils/validation';
import { logger } from '../config/logger';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = orderValidation.create.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const order = await this.orderService.createOrder(value);
      res.status(201).json({
        message: 'Pedido criado com sucesso',
        order,
      });
    } catch (error: any) {
      logger.error('Error creating order', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;

      let orders;
      if (status) {
        orders = await this.orderService.getOrdersByStatus(status as any);
      } else {
        orders = await this.orderService.getOrders(page, limit);
      }

      res.json({ orders });
    } catch (error: any) {
      logger.error('Error getting orders', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getOrderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderById(id);
      
      if (!order) {
        res.status(404).json({ error: 'Pedido não encontrado' });
        return;
      }

      res.json({ order });
    } catch (error: any) {
      logger.error('Error getting order by id', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getUserOrders(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const orders = await this.orderService.getUserOrders(userId, page, limit);
      res.json({ orders });
    } catch (error: any) {
      logger.error('Error getting user orders', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async updateOrder(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = orderValidation.update.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const { id } = req.params;
      const order = await this.orderService.updateOrder(id, value);
      
      res.json({
        message: 'Pedido atualizado com sucesso',
        order,
      });
    } catch (error: any) {
      logger.error('Error updating order', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async confirmOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.confirmOrder(id);
      
      res.json({
        message: 'Pedido confirmado com sucesso',
        order,
      });
    } catch (error: any) {
      logger.error('Error confirming order', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async processOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.processOrder(id);
      
      res.json({
        message: 'Pedido colocado em processamento',
        order,
      });
    } catch (error: any) {
      logger.error('Error processing order', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async shipOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.shipOrder(id);
      
      res.json({
        message: 'Pedido marcado como enviado',
        order,
      });
    } catch (error: any) {
      logger.error('Error shipping order', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async deliverOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.deliverOrder(id);
      
      res.json({
        message: 'Pedido marcado como entregue',
        order,
      });
    } catch (error: any) {
      logger.error('Error delivering order', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }

  async cancelOrder(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await this.orderService.cancelOrder(id);
      
      res.json({
        message: 'Pedido cancelado com sucesso',
        order,
      });
    } catch (error: any) {
      logger.error('Error cancelling order', { error: error.message });
      res.status(400).json({ error: error.message });
    }
  }
}
