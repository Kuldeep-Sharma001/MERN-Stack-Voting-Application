import jwt from 'jsonwebtoken';

const jwtAuthMiddleware = (req, res, next) => {
    // Check request headers has authorization
    const authorization = req.headers.authorization;
    if (!authorization) return res.status(401).json({ error: 'Token not found' });

    // Extract the jwt token
    const token = authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        // Verify the JWT 
        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);
        // Attach user information to the request object
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Invalid Token' });
    }
}

const generateToken = (userData) => {
    // Generate a new token
    return jwt.sign(userData, process.env.JWT_SECRETKEY, { expiresIn: '5d' });
}

export { jwtAuthMiddleware, generateToken };