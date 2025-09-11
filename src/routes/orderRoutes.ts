import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
const orderController = new OrderController();

// All order routes require authentication
router.use(authenticateToken);

router.post('/', orderController.createOrder.bind(orderController));
router.get('/', orderController.getOrders.bind(orderController));
router.get('/my-orders', orderController.getUserOrders.bind(orderController));
router.get('/:id', orderController.getOrderById.bind(orderController));
router.put('/:id', orderController.updateOrder.bind(orderController));

// Order status management
router.patch('/:id/confirm', orderController.confirmOrder.bind(orderController));
router.patch('/:id/process', orderController.processOrder.bind(orderController));
router.patch('/:id/ship', orderController.shipOrder.bind(orderController));
router.patch('/:id/deliver', orderController.deliverOrder.bind(orderController));
router.patch('/:id/cancel', orderController.cancelOrder.bind(orderController));

export { router as orderRoutes };
