import { prisma } from '../config/database';
import { Product, CreateProductInput, UpdateProductInput } from '../types/product';

export class ProductRepository {
  async create(data: CreateProductInput): Promise<Product> {
    return prisma.product.create({
      data,
    });
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findByBlingId(blingId: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { blingId },
    });
  }

  async update(id: string, data: UpdateProductInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Product> {
    return prisma.product.delete({
      where: { id },
    });
  }

  async findMany(skip?: number, take?: number): Promise<Product[]> {
    return prisma.product.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        stock: {
          increment: quantity,
        },
      },
    });
  }

  async findLowStock(threshold: number = 10): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        stock: {
          lte: threshold,
        },
      },
    });
  }
}
