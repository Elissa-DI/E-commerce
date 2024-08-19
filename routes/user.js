import express from 'express';
import { registerUser, loginUser, getUser, updateUser, deleteUser } from '../controllers/authController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
//users
router.get('/profile', auth, getUser);
router.put('/profile', auth, updateUser);
router.delete('/profile', auth, deleteUser);

export default router;