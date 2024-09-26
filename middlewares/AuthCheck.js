const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error("JWT_SECRET environment variable is not set.");
}

/**
 * Middleware to check JWT and validate user roles.
 * @param {Array<string>} roles - Array of roles that are allowed access.
 * @returns {Function} Middleware function for Express.
 */

const AuthCheck = (roles) => {
    return (req, res, next) => {
        const { authorization } = req.headers;

        if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authentication token is required.'
            });
        }

        const token = authorization.split(' ')[1];

        try {
            const decoded = jwt.verify(token, jwtSecret);
            
            const {
                id,
                name,
                email,
                avatar,
                role,
                companyId,
                shopId
            } = decoded;

            if (roles.includes(role)) {
                req.user = {
                    id,
                    name,
                    email,
                    role,
                    avatar,
                    companyId,
                    shopId
                };
                return next();
            } else {
                return res.status(403).json({
                    message: 'Access denied: insufficient role permissions.'
                });
            }
        } catch (error) {
            console.error('Authentication error:', error.message);

            const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;
            const message = error.name === 'TokenExpiredError' ? 'Token has expired.' : 'Authentication failed.';

            return res.status(statusCode).json({
                message
            });
        }
    };
};

module.exports = AuthCheck;