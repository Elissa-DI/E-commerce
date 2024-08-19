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

        if (req.user.role !== 'ADMIN') {
            return res
                .status(403)
                .json({
                    msg: 'Access denied. Admins only.'
                })
        }

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

        const { error } = productSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ msg: error.details[0].message });
        }

        let product = await prisma.product.findUnique({
            where: { id: String(id) },
        });

        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        product = await prisma.product.update({
            where: { id: String(id) },
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
        if (req.user.role !== 'ADMIN') {
            return res
                .status(403)
                .json({
                    msg: 'Access denied. Admins only.'
                })
        }

        const { id } = req.params;

        const product = await prisma.product.findUnique({
            where:
            {
                id: String(id)
            },
        });

        if (!product) {
            return res
                .status(404)
                .json({
                    msg: 'Product not found'
                });
        }

        await prisma.product.delete({
            where:
            {
                id: (id)
            },
        });

        res
            .status(200)
            .json({
                msg: `${product.name} Product deleted successfully`
            });
    } catch (error) {
        console.error(
            'Error deleting product:',
            error.message
        );
        res
            .status(500)
            .json({
                msg: 'Server error'
            });
    }
};

export const addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const { id: productId } = req.params;
        const userId = req.user.id;

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                productId,
                userId
            }
        });

        res
            .status(201)
            .json({
                msg: 'Review added successfully',
                review
            });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
}

export const viewReviews = async (req, res) => {
    try {
        const { id: productId } = req.params;

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: { user: true }
        });

        res
            .status(200)
            .json({
                msg: 'Reviews retrieved successfully',
                reviews
            });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user || user.role !== 'ADMIN') {
            return res
                .status(403)
                .json({
                    msg: 'Access denied. Only admins can delete reviews.'
                });
        }

        const review = await prisma.review.findUnique({
            where: { id: reviewId }
        });

        if (!review) {
            return res
                .status(404)
                .json({
                    msg: 'Review not found'
                });
        }

        await prisma.review.delete({
            where: { id: reviewId }
        });

        res
            .status(200)
            .json({
                msg: 'Review deleted successfully'
            });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
};

export const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;

        const products = await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } }
                ]
            }
        });

        res
            .status(200)
            .json({
                msg: 'Products retrieved successfully',
                products
            });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
};

export const filterProducts = async (req, res) => {
    try {
        const { category, priceMin, priceMax } = req.query;

        const products = await prisma.product.findMany({
            where: {
                AND: [
                    category ? { category: { equals: category } } : {},
                    priceMin ? { price: { gte: parseFloat(priceMin) } } : {},
                    priceMax ? { price: { lte: parseFloat(priceMax) } } : {}
                ]
            }
        });

        res
            .status(200)
            .json({
                msg: 'Products retrieved successfully',
                products
            });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
};

