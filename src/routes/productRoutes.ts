import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
const productController = new ProductController();

// All product routes require authentication
router.use(authenticateToken);

router.post('/', productController.createProduct.bind(productController));
router.get('/', productController.getProducts.bind(productController));
router.get('/low-stock', productController.getLowStockProducts.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.put('/:id', productController.updateProduct.bind(productController));
router.patch('/:id/stock', productController.updateStock.bind(productController));
router.delete('/:id', productController.deleteProduct.bind(productController));

export { router as productRoutes };
