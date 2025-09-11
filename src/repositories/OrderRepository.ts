import { prisma } from '../config/database';
import { Order, OrderItem, CreateOrderInput, UpdateOrderInput, OrderStatus } from '../types/order';

export class OrderRepository {
  async create(data: CreateOrderInput): Promise<Order> {
    const order = await prisma.order.create({
      data: {
        userId: data.userId,
        status: 'PENDING',
        total: 0, // Will be calculated after adding items
      },
    });

    return order;
  }

  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: true,
        shipments: true,
      },
    });
  }

  async findByUserId(userId: string, skip?: number, take?: number) {
    return prisma.order.findMany({
      where: { userId },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateOrderInput): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Order> {
    return prisma.order.delete({
      where: { id },
    });
  }

  async findMany(skip?: number, take?: number) {
    return prisma.order.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async addOrderItem(orderId: string, productId: string, quantity: number, price: number): Promise<OrderItem> {
    return prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity,
        price,
      },
    });
  }

  async updateTotal(orderId: string, total: number): Promise<Order> {
    return prisma.order.update({
      where: { id: orderId },
      data: { total },
    });
  }

  async findByStatus(status: OrderStatus) {
    return prisma.order.findMany({
      where: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        orderItems: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
