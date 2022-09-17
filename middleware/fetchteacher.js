const jwt = require('jsonwebtoken');
const dotenv =require('dotenv').config()
const JWT_SECRET1 = process.env.JWT_SECRET1;

const fetchuser = (req, res, next) => {
    const authToken = req.header('auth-Token');
    if (!authToken) {
        res.status(401).send({ error: "PLease authenticate Using valid token" });
    }

    try {
        const data = jwt.verify(authToken, JWT_SECRET1);
        req.user = data.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Occured");
    }
}

module.exports = fetchuser;