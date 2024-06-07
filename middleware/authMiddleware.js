import jwt from 'jsonwebtoken';
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

    req.flash('errors', "Veuillez vous connecter");
    return res.render("auth/login", { token: req.session.token, errors: req.flash('errors') });
  }

  try {
    // Verify the token with jwt
   
    const decoded = jwt.verify(token, secretKey);

    // add user id to the req auth
    req.auth = {
        userId: decoded.userId
    };
  
    next();
  } catch (error) {
    console.error('Error in authMiddleware')
    console.error(error)

    req.flash('errors', "Veuillez vous connecter");
    return res.render("auth/login", { token: req.session.token, errors: req.flash('errors') });
  }
};

export default authMiddleware;