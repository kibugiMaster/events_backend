import { verifyAccessToken } from "../utils/jwt.js";

// Require valid Bearer access token
export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 1, message: 'User unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = await verifyAccessToken(token);
        req.user = decoded;
        return next();
    } catch (err) {
        return res.status(401).json({ status: 1, message: 'Invalid or expired access token' });
    }
}

