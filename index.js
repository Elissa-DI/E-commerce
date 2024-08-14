import express from 'express';
import dotenv from "dotenv";
import userRoutes from './routes/user.js';
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/ordersRoutes.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

//middleware
app.use(express.json());

//Routes
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)

app.get('/', (req, res) => {
    res.send('Hello Welcome to our minimal E-Commerce backend system!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})