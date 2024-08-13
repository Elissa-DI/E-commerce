import express from 'express';
import {
createProduct,
deleteProduct,
getAllProducts,
getProductById,
updateProduct
} from '../controllers/productController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', auth, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

export default router;