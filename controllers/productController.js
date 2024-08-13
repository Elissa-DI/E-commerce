import prisma from '../utils/database.js';
import { productSchema } from '../schemas/product.js';

export const createProduct = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.
                status(400).
                json({
                    msg: error.details[0].message
                })
        }

        const { name, description, price, category, stock } = req.body;

        // Check if the user is an admin
        if (req.user.role !== 'ADMIN') {
            return res
                .status(403)
                .json({
                    msg: 'Access denied. Admins only.'
                })
        }
        //Create a product
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                category,
                stock
            },
        });

        res
            .status(201)
            .json({
                msg: 'Product created successfully',
                product
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};




export const getAllProducts = async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res
            .status(200)
            .json(products);
    } catch (error) {
        console.error('Error retrieving products:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
}





export const deleteProduct = async (req, res) => {
    try {
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.
                status(400).
                json({
                    msg: error.details[0].message
                })
        }


    } catch (error) {

    }
}