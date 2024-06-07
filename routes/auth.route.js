import express from "express";

const auth = express.Router();

import AuthController from "../controllers/auth.controller.js";


auth.get('/register',AuthController.getRegisterController)
auth.post('/register',AuthController.postRegisterController)
auth.get('/login',AuthController.getLoginController)
auth.post('/login',AuthController.postLoginController)
auth.get('/logout',AuthController.getLogoutController)
export default auth;
