import express from "express";
import { 
    register, login, verifyEmail, logout, forgotPassword, resetPassword, checkAuth
 } from "../controllers/auth.controller.js";
 import { verifyToken } from "../middlewares/verifyToken.js";

 const router = express.Router();

    router.get("/checkAuth", verifyToken, checkAuth);
    router.post("/register", register);
    router.post("/login", login);
    router.post("/verifyEmail", verifyEmail);
    router.get("/logout", verifyToken, logout);
    router.post("/forgotPassword", forgotPassword);
    router.post("/resetPassword", resetPassword);

    export default router;