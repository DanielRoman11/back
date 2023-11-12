import express from "express";
import { login, loginForm, register, registerForm } from "../controllers/user.Controller.js";

const routes = express.Router();

routes.get('/register', registerForm);
routes.post('/register', register);
routes.get('/login', loginForm)
routes.post('/login', login);


export default routes;