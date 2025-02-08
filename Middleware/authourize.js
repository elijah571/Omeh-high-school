import jwt from 'jsonwebtoken';
import { Administrative } from '../Models/administative.js';

// Middleware to authorize only admins
export const authorizeAdmin = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Administrative.findById(decodedToken.id);

        if (!admin || !admin.isAdmin) { 
            return res.status(403).json({ message: "Access denied. Admins only" });
        }

        req.admin = admin;
        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
