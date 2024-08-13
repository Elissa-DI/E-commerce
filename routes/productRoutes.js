import express from 'express';
import { createProduct, getAllProducts } from '../controllers/productController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', auth, createProduct)
router.get('/', getAllProducts)

export default router;