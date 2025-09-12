import { Router } from 'express';
import { CorreiosService } from '../services/CorreiosService';
import { authenticateToken } from '../middlewares/auth';
import { logger } from '../config/logger';

const router = Router();
const correiosService = new CorreiosService();

// All shipping routes require authentication
router.use(authenticateToken);

router.post('/calculate', async (req, res) => {
  try {
    const { originCep, destinationCep, weight, length, width, height, value } = req.body;

    if (!originCep || !destinationCep || !weight || !length || !width || !height) {
      res.status(400).json({ 
        error: 'Dados obrigatórios: originCep, destinationCep, weight, length, width, height' 
      });
      return;
    }

    const calculations = await correiosService.calculateShipping({
      originCep,
      destinationCep,
      weight,
      length,
      width,
      height,
      value, // opcional
    });

    res.json({
      message: 'Cálculo de frete realizado com sucesso',
      calculations: calculations.map(calc => ({
        service: calc.serviceName,
        serviceCode: calc.service,
        price: calc.price,
        deliveryTime: calc.deliveryTime,
        error: calc.error,
      })),
    });
  } catch (error: any) {
    logger.error('Error calculating shipping', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

router.get('/track/:trackingCode', async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const tracking = await correiosService.trackPackage(trackingCode);

    res.json({ tracking });
  } catch (error: any) {
    logger.error('Error tracking package', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

router.get('/cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    const cepInfo = await correiosService.getCepInfo(cep);

    res.json({ cepInfo });
  } catch (error: any) {
    logger.error('Error getting CEP info', { error: error.message });
    res.status(400).json({ error: error.message });
  }
});

router.get('/validate-cep/:cep', async (req, res) => {
  try {
    const { cep } = req.params;
    const isValid = await correiosService.validateCep(cep);

    res.json({ 
      cep,
      isValid,
    });
  } catch (error: any) {
    logger.error('Error validating CEP', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

export { router as shippingRoutes };
