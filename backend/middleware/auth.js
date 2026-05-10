import supabase from '../config/supabase.js';
import jwt from 'jsonwebtoken';

const ADMIN_JWT_SECRET = process.env.ADMIN_PASS || 'duihiudsks7^%^nsfohfas0832893254rjlawr9^%^&NSFZHSHAFI%&';

export const extractAuthToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        req.authToken = authHeader.substring(7);
    }

    next();
};

export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Access token required',
                error: 'No authorization header found'
            });
        }

        const token = authHeader.substring(7);

        
        try {
            const decoded = jwt.verify(token, ADMIN_JWT_SECRET);
            if (decoded.isAdmin) {
                req.user = { isAdmin: true, username: decoded.username };
                req.authToken = token;
                return next();
            }
        } catch (jwtError) {
        }

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                message: 'Invalid or expired token',
                error: error?.message || 'Authentication failed'
            });
        }

        // Attach user information to request
        req.user = user;
        req.authToken = token;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication failed',
            error: error.message
        });
    }
};

// Generate admin JWT token
export const generateAdminToken = (username) => {
    return jwt.sign(
        { isAdmin: true, username },
        ADMIN_JWT_SECRET,
        { expiresIn: '24h' }
    );
};
