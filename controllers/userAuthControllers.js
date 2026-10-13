const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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
                error: error.message
            })
        } else {
            // After unique email check, create user
            const newUser = await User.create({ name, email, password });



            res.status(201).json({
                success: true,
                data: newUser
            })
        }

        

    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        })
    }
}

// Receives: id, name, email, password, createdAt and updatedAt
// checks if user already exists
// hashes password w/ bcrypt
// prisma.create (?)
// 200 success
// 400 error