import { 
  Order as PrismaOrder, 
  OrderItem as PrismaOrderItem, 
  Payment as PrismaPayment,
  Shipment as PrismaShipment
} from '@prisma/client';

// Define enum types manually since SQLite doesn't support enums
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'REFUNDED';
export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'BOLETO' | 'TRANSFER';
export type ShipmentStatus = 'PENDING' | 'PREPARING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED';

export type Order = PrismaOrder;
export type OrderItem = PrismaOrderItem;
export type Payment = PrismaPayment;
export type Shipment = PrismaShipment;

export interface CreateOrderInput {
  userId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface UpdateOrderInput {
  status?: OrderStatus;
}

export interface CreatePaymentInput {
  orderId: string;
  method: PaymentMethod;
  amount: number;
}

export interface CreateShipmentInput {
  orderId: string;
  carrier?: string;
}

export interface UpdateShipmentInput {
  trackingCode?: string;
  carrier?: string;
  status?: ShipmentStatus;
}
