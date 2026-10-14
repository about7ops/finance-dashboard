const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const saltRounds = 10;

exports.register = async (req, res) => {
    try {
        // Extract data from request body
        const { name, email, password } = req.body;

        // Check if user already exists
        const emailCheck = await prisma.user.findUnique({
            where: { email: email },
        });

        if (emailCheck) {
            // User already exists
            res.status(400).json({
                success: false,
                error: 'Email already in use'
            })
        }

        else {
            // After unique email check, create user and hash password
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await prisma.user.create({ 
                data: { name, email, password: hashedPassword }
            });

            // Strip password before sending response
            const { password: _, ...userWithoutPassword } = newUser;

            res.status(201).json({
                success: true,
                data: userWithoutPassword
            })
        }
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
};