import jwt from 'jsonwebtoken';
import utils from '../utils/utilsResponse.js'
import dotenv from "dotenv";
dotenv.config();
const secretKey = process.env.SECRET_KEY_JWT_AUTH;
/***
 * authMiddleware is a fonction midleware for check if user authenticate 
 */
const authMiddleware = (req, res, next) => {
  // Get the token from the request headers
  const token = req.session.token;

  // Check if there is a token
  if (!token) {

    return res.render('auth/login')
  }

  try {
    // Verify the token with jwt
   
    const decoded = jwt.verify(token.split(' ')[1], secretKey);

    // add user id to the req auth
    req.auth = {
        userId: decoded.userId
    };
  
    next();
  } catch (error) {
    console.error('Error in authMiddleware')
    console.error(error)
    const ret = {
        statusCode:401,
        message:  'Token is not valid',
        data:  null
    }
    return res.render('/auth/login')
  }
};

export default authMiddleware;