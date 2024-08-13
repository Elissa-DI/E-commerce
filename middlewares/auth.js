import jwt from "jsonwebtoken";
import prisma from "../utils/database.js";


const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({
        msg: 'No token, authorization denied'
    });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            }
        });
        if (!user) return res.status(404).json({
            msg: 'User not found'
        });

        req.user.role = user.role;
        next();
    } catch (err) {
        res.status(401).json({
            msg: 'Invalid token'
        });
    }
}

export default auth;