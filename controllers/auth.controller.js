import utilsForm from "../utils/utilsForm.js";
import UserModel from "../Models/User.model.js"
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
dotenv.config();

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
const  postRegisterController = async (req,res) => {
  try{

    // check missing fields
    const requiredFields = [ 'firstName','lastName',"email","password","password_confirm"];
      const missingFields = utilsForm.checkMissingField(req,requiredFields)
      if (missingFields.length > 0) {
        for (let field of missingFields){
          req.flash('errors', `Le champs "${field}" est requis.`);
        }
        return res.render("auth/register", { token: req.session.token, errors: req.flash('errors') });
      }

      let { lastName, firstName, email, password, password_confirm } = req.body;
      email = email.toLowerCase()

      // check password
      const errors = await utilsForm.checkPasswordCondition(password,password_confirm)

      // return error if password condition not pass
      if (errors.length > 0) {
        for (let error of errors){
          req.flash('errors', error.msg);
        }
        
        return res.render("auth/register", { token: req.session.token, errors: req.flash('errors') });

      }
      // check if user exist
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {

        req.flash('errors', "Un utilisateur existe déjà avec cette adresse email.");
        return res.render("auth/register", { token: req.session.token, errors: req.flash('errors') });
        }

      const passwordHash = CryptoJS.HmacSHA256(password, process.env.SECRET_KEY_HASH).toString();
      // create user with data
      const newUser = new UserModel({
        lastName,
        firstName,
        email:email.toLowerCase(),
        password: passwordHash,
      });
      // save user in database
      const userSave = await newUser.save();

      // redirect to login page
      if (userSave){
        return res.redirect("/auth/login");
      } else {
        // If mongoose error
        req.flash('errors', "Une erreur interne est survenu");
        return res.render("auth/register", { token: req.session.token, errors: req.flash('errors') });
      }
     
  }catch (error){
  console.log(error);
    req.flash('errors', "Une erreur interne est survenu");
    return res.render("auth/register", { token: req.session.token, errors: req.flash('errors') });
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getRegisterController = async (req,res) => {
  //redirect ro register page
  res.render("auth/register", { token: req.session.token, errors: req.flash('errors'),success: req.flash('success') });

}

const postLoginController = async (req,res) => {
  try {

    // check missing field
    const requiredFields = ['email', 'password'];
    
   const missingFields = utilsForm.checkMissingField(req,requiredFields)
   if (missingFields.length > 0) {
    for (let field of missingFields){
      req.flash('errors', `Le champs "${field}" est requis.`);
    }
    return res.render("auth/login", { token: req.session.token, errors: req.flash('errors') });
  }
  const {email,password} = req.body
    // Get user with email
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    // Return response if user does not exist
    if (!user) {
      req.flash('errors', `Email ou mot de passe invalide.`);
   
      return res.render("auth/login", { token: req.session.token, errors: req.flash('errors') });
    }
    // Compare the password
    const valid =  CryptoJS.HmacSHA256(password, process.env.SECRET_KEY_HASH).toString() === user.password;
  
    // Return response if password is not valid
    if (!valid) {
      req.flash('errors', `Email ou mot de passe invalide.`);
   
      return res.render("auth/login", { token: req.session.token, errors: req.flash('errors') });
    }

    // creat jwt token
    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY_JWT_AUTH,
      { expiresIn: '24h' }
    )
    // put token in session
    req.session.token = token
    // redirect to dashboardPage
    return res.redirect('/dashboard')
  } catch (error) {
    // redirect to login page with errors
    console.log('error',error);
    req.flash('errors', "Une erreur interne est survenu");
    return res.render("auth/login", { token: req.session.token, errors: req.flash('errors') });
  }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getLoginController = async (req,res) => {
  // redirect to login page
  res.render("auth/login" ,{ token: req.session.token , errors: req.flash('errors'),success: req.flash('success') });

}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
const getLogoutController = async (req,res) => {
  // destroy session for logout
  req.session.destroy(err => {
    if (err) {
      console.error('Erreur lors de la destruction de la session:', err);
    } else {
      console.log('Session détruite avec succès.');
      // redirect to login page
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