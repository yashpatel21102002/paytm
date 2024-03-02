const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({})
    }
    const token = authHeader.split(' ')[1];
    

    try {
        const decoded = jwt.verify(token, "Hanuman@2201")
        console.log(decoded)
        req.userId = decoded.user_id;
        next()

    } catch (e) {
        return res.status(403).json({})
    }
}

module.exports = authMiddleware