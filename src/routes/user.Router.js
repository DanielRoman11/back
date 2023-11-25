import express from "express";
import { login, loginForm, profilePage, register, registerForm } from "../controllers/user.Controller.js";
import { authMiddleware } from "../middlewares/user.auth.js";

const routes = express.Router();

routes.get('/register', registerForm);
routes.post('/register', register);
routes.get('/login', loginForm)
routes.post('/login', login);
routes.get('/profile', authMiddleware, profilePage)


export default routes;