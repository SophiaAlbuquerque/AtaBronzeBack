import { Product as PrismaProduct } from '@prisma/client';

export type Product = PrismaProduct;

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock: number;
  blingId?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  blingId?: string;
}
