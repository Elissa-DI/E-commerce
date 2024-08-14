import express from 'express';
import auth from '../middlewares/auth.js';
import { addToCart, updateCart, viewCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/', auth, addToCart);
router.get('/', auth, viewCart);
router.put('/', auth, updateCart)

export default router