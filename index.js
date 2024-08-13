import express from 'express';
import userRoutes from './routes/user.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3005;

//middleware
app.use(express.json());

//Routes
app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
    res.send('Hello Welcome to the E-Commerce backend system Feel free to explore our api endpoints!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})