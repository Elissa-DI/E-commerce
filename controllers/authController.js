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
