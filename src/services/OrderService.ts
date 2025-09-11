import { OrderRepository } from '../repositories/OrderRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { CreateOrderInput, UpdateOrderInput, Order, OrderStatus } from '../types/order';
import { logger } from '../config/logger';

export class OrderService {
  private orderRepository: OrderRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
    this.productRepository = new ProductRepository();
  }

  async createOrder(data: CreateOrderInput) {
    // Create the order first
    const order = await this.orderRepository.create(data);
    
    let totalAmount = 0;

    // Add order items and calculate total
    for (const item of data.items) {
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        throw new Error(`Produto não encontrado: ${item.productId}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Estoque insuficiente para o produto: ${product.name}`);
      }

      const itemTotal = Number(product.price) * item.quantity;
      totalAmount += itemTotal;

      await this.orderRepository.addOrderItem(
        order.id,
        product.id,
        item.quantity,
        Number(product.price)
      );

      // Update product stock
      await this.productRepository.updateStock(product.id, -item.quantity);
    }

    // Update order total
    const updatedOrder = await this.orderRepository.updateTotal(order.id, totalAmount);

    logger.info('Order created', { 
      orderId: updatedOrder.id, 
      userId: data.userId,
      total: totalAmount,
      itemsCount: data.items.length
    });

    return this.orderRepository.findById(updatedOrder.id);
  }

  async getOrderById(id: string) {
    return this.orderRepository.findById(id);
  }

  async updateOrder(id: string, data: UpdateOrderInput): Promise<Order> {
    const order = await this.orderRepository.update(id, data);
    
    logger.info('Order updated', { 
      orderId: order.id, 
      status: order.status 
    });

    return order;
  }

  async cancelOrder(id: string): Promise<Order> {
    const orderWithItems = await this.orderRepository.findById(id);
    if (!orderWithItems) {
      throw new Error('Pedido não encontrado');
    }

    if (orderWithItems.status === 'SHIPPED' || orderWithItems.status === 'DELIVERED') {
      throw new Error('Não é possível cancelar pedidos já enviados ou entregues');
    }

    // Restore product stock
    if (orderWithItems.orderItems) {
      for (const item of orderWithItems.orderItems) {
        await this.productRepository.updateStock(item.productId, item.quantity);
      }
    }

    const cancelledOrder = await this.orderRepository.update(id, { status: 'CANCELLED' });
    
    logger.info('Order cancelled', { orderId: id });

    return cancelledOrder;
  }

  async getUserOrders(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.orderRepository.findByUserId(userId, skip, limit);
  }

  async getOrders(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.orderRepository.findMany(skip, limit);
  }

  async getOrdersByStatus(status: OrderStatus) {
    return this.orderRepository.findByStatus(status);
  }

  async confirmOrder(id: string): Promise<Order> {
    return this.updateOrder(id, { status: 'CONFIRMED' });
  }

  async processOrder(id: string): Promise<Order> {
    return this.updateOrder(id, { status: 'PROCESSING' });
  }

  async shipOrder(id: string): Promise<Order> {
    return this.updateOrder(id, { status: 'SHIPPED' });
  }

  async deliverOrder(id: string): Promise<Order> {
    return this.updateOrder(id, { status: 'DELIVERED' });
  }
}
