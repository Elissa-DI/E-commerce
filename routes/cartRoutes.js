import express from 'express';
import auth from '../middlewares/auth.js';
import { addToCart, removeFromCart, updateCart, viewCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/', auth, addToCart);
router.get('/', auth, viewCart);
router.put('/:itemId', auth, updateCart);
router.delete('/:itemId', auth, removeFromCart);

export default router