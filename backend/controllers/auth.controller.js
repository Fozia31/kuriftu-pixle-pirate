import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { signupSchema, loginSchema } from '../validators/auth.validator.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

export const signup = async (req, res) => {
    try {
        console.log('Signup Request Body:', req.body);
        // Validate request body
        const validatedData = signupSchema.parse(req.body);

        const { name, email, password, role, preferences } = validatedData;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'GUEST',
            preferences: preferences || []
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Signup Error:', error);
        if (error.errors && !error.message.includes('validation failed')) {
            // Zod errors
            return res.status(400).json({ error: error.errors[0].message });
        }
        // Mongoose or other errors
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        // Validate request body
        const validatedData = loginSchema.parse(req.body);
        const { email, password } = validatedData;
        
        // --- MASTER LOGIN BYPASS (Hardcoded for Trial) ---
        const MASTER_PASSWORD = 'kuriftu123';
        const MASTER_ACCOUNTS = {
            'admin@kuriftu.com': { name: 'Executive Director', role: 'EXECUTIVE_ADMIN', id: '000000000000000000000001' },
            'rooms@kuriftu.com': { name: 'Rooms Director', role: 'ROOM_MANAGER', id: '000000000000000000000002' },
            'spa@kuriftu.com': { name: 'Spa Director', role: 'SPA_MANAGER', id: '000000000000000000000003' }
        };

        if (MASTER_ACCOUNTS[email] && password === MASTER_PASSWORD) {
            const acc = MASTER_ACCOUNTS[email];
            return res.json({
                _id: acc.id,
                name: acc.name,
                email: email,
                role: acc.role,
                token: generateToken(acc.id)
            });
        }
        // ------------------------------------------------

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        if (error.errors) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        res.status(500).json({ error: error.message });
    }
};
