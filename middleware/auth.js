const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization').replace('Bearer ', '');
        const verification = await jwt.verify(authToken, process.env.AUTH_SECRET);
        const user = await User.findOne({ '_id': verification._id, 'tokens.token': authToken });
        if (!user) {
            throw new Error();
        }
        req.token = authToken;
        req.user = user;
        next();
    } catch {
        res.status(401).send('Invalid Authorization');
    }
};

module.exports = auth;