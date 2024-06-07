import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/authMiddleware.js";
import AuthController from "../controllers/auth.controller.js"
import routesController from "../controllers/home.controller.js"
router.get("/", AuthController.getRegisterController);
router.get("/dashboard", authMiddleware,routesController.getDashboardController);


export default router;
