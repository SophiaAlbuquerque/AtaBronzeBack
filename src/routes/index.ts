import { Router } from 'express';
import { userRoutes } from './userRoutes';
import { productRoutes } from './productRoutes';
import { orderRoutes } from './orderRoutes';
import { paymentRoutes } from './paymentRoutes';
import { shippingRoutes } from './shippingRoutes';

const router = Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'AtaBronze API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/shipping', shippingRoutes);

export { router as apiRoutes };
