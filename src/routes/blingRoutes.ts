import { Router } from 'express';
import { BlingController } from '../controllers/BlingController';

const router = Router();
const blingController = new BlingController();

// OAuth authorization
router.get('/auth', blingController.getAuthUrl.bind(blingController));

// OAuth callback
router.get('/callback', blingController.handleCallback.bind(blingController));

// Check authentication status
router.get('/status', blingController.getStatus.bind(blingController));

export default router;
