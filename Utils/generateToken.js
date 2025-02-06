import jwt from 'jsonwebtoken';

export const generateToken = (res, { id }) => {
    try {
        // Generate JWT token
        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "30d"
        });

        // Set the token as a secure, HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,          
            sameSite: "strict", 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error generating token.' });
    }
};
