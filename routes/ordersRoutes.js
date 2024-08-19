import express from 'express';
import auth from '../middlewares/auth.js';
import { cancelOrder, createOrder, getAllOrders, getOrderById, getOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrderById);
router.delete('/:id', auth, cancelOrder);
router.get('/admin/orders', auth, getAllOrders); 
router.put('/admin/orders/:id/status', auth, updateOrderStatus);

export default router