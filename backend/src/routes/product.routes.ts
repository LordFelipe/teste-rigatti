import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authenticate, authorizeAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', ProductController.findAll);

//Apenas para admins
router.post('/', authorizeAdmin, ProductController.create);
router.put('/:id', authorizeAdmin, ProductController.update);
router.delete('/:id', authorizeAdmin, ProductController.delete);

export default router;