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

        res
            .status(201)
            .json({
                msg: 'Item added to cart',
                cartItem
            })
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
}