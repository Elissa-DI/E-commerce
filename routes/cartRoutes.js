import express from 'express';
import auth from '../middlewares/auth.js';
import { addToCart } from '../controllers/cartController.js';

const router = express.Router();

router.post('/create', auth, addToCart);

export default router