const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const auth = require('auth')
dotenv.config()

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = auth && authHeader.split (' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);
        req.emailUser = decoded.emailUser;
        next()
    })
}

module.exports = verifyToken