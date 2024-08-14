import prisma from "../utils/database.js";

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartItems = await prisma.cartItem.findMany({
            where: {
                userId
            },
            include: {
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

        if (cartItems.length === 0) {
            return res
                .status(400)
                .json({
                    msg: 'Cart is empty'
                });
        }

        const order = await prisma.order.create({
            data: {
                userId,
                status: 'PENDING',
            }
        });

        // Clear the user's cart after creating the order
        await prisma.cartItem.deleteMany({
            where: { userId }
        });

        res
            .status(201)
            .json({
                msg: 'Order created successfully',
                order
            });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
}

export const getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const status = req.query.status?.toUpperCase(); // Optional query parameter to filter by status

        const whereCondition = { userId };
        if (status && ['PENDING', 'COMPLETED'].includes(status)) {
            whereCondition.status = status;
        }

        const orders = await prisma.order.findMany({
            where: whereCondition
        });

        res
            .status(200)
            .json(orders);
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
};

export const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const orderId = req.params.id;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!order || order.userId !== userId) {
            return res
                .status(404)
                .json({
                    msg: 'Order not found or access denied'
                });
        }

        res
            .status(200)
            .json(order);
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
};
