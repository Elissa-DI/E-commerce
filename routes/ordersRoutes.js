import express from 'express';
import auth from '../middlewares/auth.js';
import { createOrder, getOrderById, getOrders } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', auth, createOrder);
router.post('/', auth, getOrders);
router.post('/:id', auth, getOrderById);

export default router