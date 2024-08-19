import express from 'express';
import {
    addReview,
    createProduct,
    deleteProduct,
    deleteReview,
    filterProducts,
    getAllProducts,
    getProductById,
    searchProducts,
    updateProduct,
    viewReviews
} from '../controllers/productController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/create', auth, createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);
//reviews
router.post('/:id/review', auth, addReview);
router.get('/:id/reviews', viewReviews)
router.delete('/:id/reviews/:reviewId', auth, deleteReview)
//search
router.get('/search', searchProducts);
router.get('/filter', filterProducts);

export default router;