import { Router } from 'express';
import { AsaasService } from '../services/AsaasService';
import { authenticateToken } from '../middlewares/auth';
import { logger } from '../config/logger';

const router = Router();
const asaasService = new AsaasService();

// All payment routes require authentication
router.use(authenticateToken);

router.post('/create', async (req, res) => {
  try {
    const { orderId, billingType, value, dueDate, description } = req.body;

    if (!orderId || !billingType || !value || !dueDate) {
      res.status(400).json({ error: 'Dados obrigatórios: orderId, billingType, value, dueDate' });
      return;
    }

    // For now, we'll use a mock customer ID
    const mockCustomerId = 'mock_customer_id';

    const payment = await asaasService.createPayment({
      customer: mockCustomerId,
      billingType,
      value,
      dueDate,
      description,
      externalReference: orderId,
    });

    res.status(201).json({
      message: 'Cobrança criada com sucesso',
      payment,
    });
  } catch (error: any) {
    logger.error('Error creating payment', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

router.get('/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await asaasService.getPayment(paymentId);

    res.json({ payment });
  } catch (error: any) {
    logger.error('Error getting payment', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await asaasService.cancelPayment(paymentId);

    res.json({
      message: 'Cobrança cancelada com sucesso',
      payment,
    });
  } catch (error: any) {
    logger.error('Error cancelling payment', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

export { router as paymentRoutes };
