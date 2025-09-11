import axios from 'axios';
import { config } from '../config';
import { logger } from '../config/logger';
import { PaymentMethod } from '../types/order';

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  cpfCnpj?: string;
}

export interface AsaasPayment {
  id: string;
  status: string;
  value: number;
  billingType: string;
  dueDate: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  pixQrCode?: string;
}

export interface CreatePaymentInput {
  customer: string; // customer ID
  billingType: PaymentMethod;
  value: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
}

export class AsaasService {
  private apiKey: string;
  private baseUrl: string;
  private sandbox: boolean;

  constructor() {
    this.apiKey = config.apis.asaas.apiKey;
    this.baseUrl = config.apis.asaas.baseUrl;
    this.sandbox = config.apis.asaas.sandbox;
  }

  private getHeaders() {
    return {
      'access_token': this.apiKey,
      'Content-Type': 'application/json',
    };
  }

  async createCustomer(customerData: Omit<AsaasCustomer, 'id'>): Promise<AsaasCustomer> {
    try {
      logger.info('Creating customer in Asaas (MOCK)', { email: customerData.email });
      
      // Mock implementation
      const mockCustomer: AsaasCustomer = {
        id: `asaas_customer_${Date.now()}`,
        name: customerData.name,
        email: customerData.email,
        cpfCnpj: customerData.cpfCnpj,
      };

      return mockCustomer;

      // Actual implementation would be:
      // const response = await axios.post(`${this.baseUrl}/customers`, customerData, {
      //   headers: this.getHeaders(),
      // });
      // return response.data;
    } catch (error) {
      logger.error('Error creating customer in Asaas', { error });
      throw new Error('Erro ao criar cliente no Asaas');
    }
  }

  async createPayment(paymentData: CreatePaymentInput): Promise<AsaasPayment> {
    try {
      logger.info('Creating payment in Asaas (MOCK)', { 
        value: paymentData.value,
        billingType: paymentData.billingType 
      });
      
      // Mock implementation
      const mockPayment: AsaasPayment = {
        id: `asaas_payment_${Date.now()}`,
        status: 'PENDING',
        value: paymentData.value,
        billingType: paymentData.billingType,
        dueDate: paymentData.dueDate,
        invoiceUrl: this.sandbox ? 'https://sandbox.asaas.com/invoice/mock' : undefined,
        bankSlipUrl: paymentData.billingType === 'BOLETO' ? 'https://sandbox.asaas.com/boleto/mock' : undefined,
        pixQrCode: paymentData.billingType === 'PIX' ? 'mock-pix-qr-code' : undefined,
      };

      return mockPayment;

      // Actual implementation would be:
      // const response = await axios.post(`${this.baseUrl}/payments`, paymentData, {
      //   headers: this.getHeaders(),
      // });
      // return response.data;
    } catch (error) {
      logger.error('Error creating payment in Asaas', { error });
      throw new Error('Erro ao criar cobrança no Asaas');
    }
  }

  async getPayment(paymentId: string): Promise<AsaasPayment> {
    try {
      logger.info('Getting payment from Asaas (MOCK)', { paymentId });
      
      // Mock implementation
      const mockPayment: AsaasPayment = {
        id: paymentId,
        status: 'CONFIRMED',
        value: 100.00,
        billingType: 'PIX',
        dueDate: new Date().toISOString(),
      };

      return mockPayment;

      // Actual implementation would be:
      // const response = await axios.get(`${this.baseUrl}/payments/${paymentId}`, {
      //   headers: this.getHeaders(),
      // });
      // return response.data;
    } catch (error) {
      logger.error('Error getting payment from Asaas', { error, paymentId });
      throw new Error('Erro ao consultar cobrança no Asaas');
    }
  }

  async cancelPayment(paymentId: string): Promise<AsaasPayment> {
    try {
      logger.info('Cancelling payment in Asaas (MOCK)', { paymentId });
      
      // Mock implementation
      const mockPayment: AsaasPayment = {
        id: paymentId,
        status: 'CANCELLED',
        value: 100.00,
        billingType: 'PIX',
        dueDate: new Date().toISOString(),
      };

      return mockPayment;

      // Actual implementation would be:
      // const response = await axios.delete(`${this.baseUrl}/payments/${paymentId}`, {
      //   headers: this.getHeaders(),
      // });
      // return response.data;
    } catch (error) {
      logger.error('Error cancelling payment in Asaas', { error, paymentId });
      throw new Error('Erro ao cancelar cobrança no Asaas');
    }
  }
}
