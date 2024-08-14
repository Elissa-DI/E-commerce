import prisma from '../utils/database.js';

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.id;

        // Check if the product exists
        const product = await prisma.product.findUnique({
            where: {
                id: productId
            }
        });
        if (!product)
            return res
                .status(404)
                .json({
                    msg: 'Product not found'
                });

        // Check if there is enough stock
        if (product.stock < quantity) {
            return res.status(400).json({
                msg: 'Insufficient stock available'
            });
        }

        // Check if the item is already in the cart
        let cartItem = await prisma.cartItem.findUnique({
            where: {
                userId_productId: {
                    userId,
                    productId
                }
            }
        });

        if (cartItem) {
            // Update the quantity if the item already exists in the cart
            cartItem = await prisma.cartItem.update({
                where: {
                    id: cartItem.id
                },
                data: {
                    quantity: cartItem.quantity + quantity
                }
            });
        } else {
            // Add new item to cart
            cartItem = await prisma.cartItem.create({
                data: {
                    userId,
                    productId,
                    quantity
                }
            });
        }

        await prisma.product.update({
            where: {
                id: productId
            },
            data: {
                stock: product.stock - quantity
            }
        });

        res
            .status(201)
            .json({
                msg: 'Item added to cart and stock updated',
                cartItem
            })
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
}

export const viewCart = async (req, res) => {
    try {
        const userId = req.user.id;
        // Retrieve the cart items for the logged-in user
        const cartItems = await prisma.cartItem.findMany({
            where: {
                userId: userId
            },
            include: {
                // Include product details in the response
                product: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        category: true
                    }
                }
            }
        });

        res
            .status(200)
            .json({
                msg: 'Cart retrieved successfully',
                cartItems
            });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
};

export const updateCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        const userId = req.user.id;

        // Find the cart item by ID and ensure it belongs to the logged-in user
        let cartItem = await prisma.cartItem.findFirst({
            where: {
                id: itemId,
                userId: userId
            }
        });

        if (!cartItem)
            return res
                .status(404)
                .json({
                    msg: 'Cart item not found'
                });

        // Update the quantity of the cart item
        cartItem = await prisma.cartItem.update({
            where: {
                id: cartItem.id
            },
            data: {
                quantity: quantity
            }
        });

        res
            .status(200)
            .json({
                msg: 'Cart item updated successfully',
                cartItem
            });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
}