const jwt = require('jsonwebtoken');
const config = require('../config');

const JWT_SECRET = config.jwtSecret || 'devsecret';

if (!config.jwtSecret) {
    console.warn('JWT_SECRET not set. Auth middleware is using a development fallback secret.');
}

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '').trim();

    if (!token) {
        return res.status(401).json({ success: false, message: 'Missing token' });
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.userId = payload.id;
        return next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

module.exports = { verifyToken };
