import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected for seeding...');

        const password = await bcrypt.hash('kuriftu123', 10);

        const users = [
            {
                name: 'Executive Director',
                email: 'admin@kuriftu.com',
                password: password,
                role: 'EXECUTIVE_ADMIN'
            },
            {
                name: 'Rooms Director',
                email: 'rooms@kuriftu.com',
                password: password,
                role: 'ROOM_MANAGER'
            },
            {
                name: 'Spa Director',
                email: 'spa@kuriftu.com',
                password: password,
                role: 'SPA_MANAGER'
            }
        ];

        for (const userData of users) {
            const exists = await User.findOne({ email: userData.email });
            if (!exists) {
                await User.create(userData);
                console.log(`Created: ${userData.email}`);
            } else {
                console.log(`Exists: ${userData.email}`);
            }
        }

        console.log('Seeding complete! You can now log in.');
        process.exit();
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seedUsers();
