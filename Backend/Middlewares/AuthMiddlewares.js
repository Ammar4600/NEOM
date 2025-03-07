import { configDotenv } from 'dotenv';
configDotenv()
import redisClient from '../Services/redisServices.js';
import jwt from 'jsonwebtoken'



export const authCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.startsWith('Bearer ')
            ? req.headers.authorization.split(' ')[1]
            : req.cookies.token;
          

        if (!token) {
            return res.status(401).json({ msg: 'Not authorized, token is required' });
        };

        const isInvalid = await redisClient.get(token);

        if (isInvalid) {
            return res.status(401).json({ msg: 'Token is BlackListed Access not authorized' });
        }
        

        const decode_id = await jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode_id;

        next()

    } catch (error) {

        console.error(error.message);

    }
}