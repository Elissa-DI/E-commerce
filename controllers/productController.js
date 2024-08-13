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



export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where: {
                id: String(id),
            }
        });

        if (!product) {
            return res
                .status(404)
                .json({
                    msg: 'Product not found'
                });
        };

        res.status(200).json(product);
    } catch (error) {
        console.error('Error retrieving product:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
}





export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, stock } = req.body;

        if (req.user.role !== 'ADMIN') {
            return res
                .status(403)
                .json({
                    msg: 'Access denied. Admins only.'
                })
        }

        // Validate the request body
        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        // Check if the product exists
        let product = await prisma.product.findUnique({
            where: { id: String(id) },
        });

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        // Update the product
        product = await prisma.product.update({
            where: { id: Number(id) },
            data: {
                name,
                description,
                price,
                category,
                stock
            },
        });

        res.status(200).json({
            msg: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Error while updating product:', error.message);
        res.status(500).json({ msg: 'Server error' });
    }
};







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