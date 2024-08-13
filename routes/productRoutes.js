import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct } from '../controllers/productController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', auth, createProduct)
router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.put('/:id', auth, updateProduct)

export default router;