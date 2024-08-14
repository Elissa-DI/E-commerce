import express from 'express';
import auth from '../middlewares/auth.js';
import { addToCart, viewCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/', auth, addToCart);
router.get('/', auth, viewCart);

export default router