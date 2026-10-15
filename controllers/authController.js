const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const saltRounds = 10;

/* login flow notes:
1. Request arrives at POST /auth/login with email and password
2. Verify email exists in DB (prisma.user.findUnique)
    If not, ask user to try again (send request back w/ SAME error)
3. Verify password is correct for email (bcrypt.compare())
    If not, ask user to try again (send request back w/ SAME error)
4. If both pass: 
    - JWT generated (jwt.sign()), payload is userID, secret key is securely generated
    - key should be generated at request(?)
5. JWT sent back in request with Set-Cookie header */

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Verify email exists
        const uniqueEmail = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!uniqueEmail) {
            res.status(400).json({
                success: false,
                error: 'Error logging in'
            });
        }

        // Verify password matches email
        if (uniqueEmail) {
            const match = await bcrypt.compare(plainPassword, storedHash);
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            error: 'Error logging in'
        });
    }
}

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