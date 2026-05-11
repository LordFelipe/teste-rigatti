import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
router.post('/', authenticate, ChatController.handleChat);

export default router;