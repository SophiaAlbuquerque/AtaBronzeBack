import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middlewares/auth';

const router = Router();
const userController = new UserController();

// Public routes
router.post('/register', userController.register.bind(userController));
router.post('/login', userController.login.bind(userController));

// Protected routes
router.get('/profile', authenticateToken, userController.getProfile.bind(userController));
router.put('/profile', authenticateToken, userController.updateProfile.bind(userController));

// Admin routes (for now, just protected - add admin middleware later)
router.get('/', authenticateToken, userController.getUsers.bind(userController));
router.get('/:id', authenticateToken, userController.getUserById.bind(userController));
router.delete('/:id', authenticateToken, userController.deleteUser.bind(userController));

export { router as userRoutes };
