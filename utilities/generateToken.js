const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

function generateToken (payload) {
    return jwt.sign(payload, jwtSecret, 
        { expiresIn: '12h' }
    );
}

module.exports = generateToken