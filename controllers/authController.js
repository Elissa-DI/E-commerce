import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../utils/database.js';
import { registerSchema, loginSchema } from '../schemas/user.js';

export const registerUser = async (req, res) => {
    try {
        // Validate request body
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ msg: error.details[0].message });

        const { name, email, password, role } = req.body;

        // Check if user already exists
        let user = await prisma.user.findUnique({ where: { email } });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save user to the database
        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role
            }
        });

        // Generate JWT
        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res
            .status(201)
            .json({
                msg: "User created successfully",
                "token": token,
                user: user
            })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
 
export const loginUser = async (req, res) => {
    try {
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ msg: error.details[0].message });

        const { email, password } = req.body;

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Incorect email or password!' });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Incorect email or password!' });

        // Generate JWT
        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res
            .status(200)
            .json({
                msg: "Login successful",
                user,
                token
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res
                .status(404)
                .json({
                    msg: 'User not found!'
                });
        }

        res
            .status(200)
            .json({
                msg: "User profile retrieved successfully",
                user
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser && existingUser.id !== userId) {
            return res
                .status(400)
                .json({
                    msg: 'Email is already in use by another account.'
                });
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: name,
                email: email
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res
            .status(200)
            .json({
                msg: 'Profile updated successfully',
                user: updatedUser
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

export const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;

        await prisma.user.delete({
            where: {
                id: userId
            }
        });

        res
            .status(200)
            .json({
                msg: 'Profile deleted successfully'
            });
    } catch (error) {
        console.error(error.message);
        res
            .status(500)
            .send('Server error');
    }
};