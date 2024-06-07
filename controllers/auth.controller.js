import utilsForm from "../utils/utilsForm.js";
import utilsApiResponse from "../utils/utilsResponse.js"
import UserModel from "../Models/User.model.js"
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
dotenv.config();

const  postRegisterController = async (req,res) => {
  console.log(req.body)
  try{
    const requiredFields = [ 'firstName','lastName',"email","password","password_confirm"];
      const missingFields = utilsForm.checkMissingField(req,requiredFields)
        
      if (missingFields.length > 0) {
        return utilsApiResponse.missingFieldResponse(res,missingFields)
      }

      let { lastName, firstName, email, password, password_confirm } = req.body;
      email = email.toLowerCase()

      const errors = await utilsForm.checkPasswordCondition(password,password_confirm)

      // return error if password condition not pass
      if (errors.length > 0) {
        console.log('Passwords do not match')
        return utilsApiResponse.response(res, {
          statusCode: 401,
          message: 'Passwords do not match',
          data: {errors},
        });
      }

      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        console.log('User already exists with this email', email)
        return utilsApiResponse.response(res, {
          statusCode: 401,
          message: 'User already exists with this email',
          data: {errors:[{msg:'errorEmailAlreadyExists'}]},
        });
        }

        const passwordHash = CryptoJS.HmacSHA256(password, process.env.SECRET_KEY_HASH).toString();
      const newUser = new UserModel({
        lastName,
        firstName,
        email:email.toLowerCase(),
        password: passwordHash,
      });

      const userSave = await newUser.save();


      if (userSave){
        utilsApiResponse.response(res, {
          statusCode: 200,
          message: 'success to register user',
          data: {email:req.body.email},
        });

      }

  }catch (error){
  console.log(error);
      return utilsApiResponse.response(res, {
        statusCode: 500,
        message: 'Failed to register user',
        data: {email:req.body.email},
      });
  }
}


const getRegisterController = async (req,res) => {

  res.render("auth/register", { token: req.session.token });

}

const postLoginController = async (req,res) => {
  console.log(req.body)
  let user;
  try {

    const requiredFields = ['email', 'password'];
    
   const missingFields = utilsForm.checkMissingField(req,requiredFields)
   if (missingFields.length > 0) {
    return utilsApiResponse.missingFieldResponse(res,missingFields)
}
  const {email,password} = req.body
    // Get user with email
    user = await UserModel.findOne({ email: email.toLowerCase() });
    // Return response if user does not exist
    if (!user) {
      return utilsApiResponse.loginPasswordInvalidResponse(res);
    }
    // Compare the password
    const valid =  CryptoJS.HmacSHA256(password, process.env.SECRET_KEY_HASH).toString() === user.password;
  
    // Return response if password is not valid
    if (!valid) {
      return utilsApiResponse.loginPasswordInvalidResponse(res);
    }


    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY_JWT_AUTH,
      { expiresIn: '24h' }
    )
    req.session.token = token
    // Send success response with a login token
    return res.render('dashboard',{ token: req.session.token})
  } catch (error) {
    // Send error response with UserID for debugging
    console.log('error',error);
    return utilsApiResponse.response(res, {
      statusCode: 500,
      message: 'Failed to login',
      data:null,
    });
  }
}


const getLoginController = async (req,res) => {
  req.flash('success', 'Je suis un flash message');
  res.render("auth/login" ,{ token: req.session.token });

}

const getLogoutController = async (req,res) => {

  req.session.destroy(err => {
    if (err) {
      console.error('Erreur lors de la destruction de la session:', err);
    } else {
      console.log('Session détruite avec succès.');
      // Rediriger vers la page de connexion
      res.redirect('/auth/login');
    }
  });


}


export default  {
  postRegisterController,
  getRegisterController,
  postLoginController,
  getLoginController,
  getLogoutController,
}