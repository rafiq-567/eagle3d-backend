import { Router } from 'express';
import { getProduct, addProduct, updateProduct, deleteProduct, getProducts } from '../controllers/productController';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware';

const router = Router();


router.get('/', getProducts);


router.get('/:id', getProduct);


router.post('/', authMiddleware, adminMiddleware, addProduct);


router.put('/:id', authMiddleware, adminMiddleware, updateProduct);


router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;