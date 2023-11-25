import express from "express";
import { authMiddleware } from "../middlewares/user.auth.js";
import { home } from "../controllers/index.Controller.js";

const routes = express.Router();

routes.get('/', authMiddleware, home);

export default routes;