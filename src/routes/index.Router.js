import express from "express";
import { authMiddleware } from "../middlewares/user.auth.js";
import { dashboard, postDashboard } from "../controllers/index.Controller.js";

const routes = express.Router();

routes.get('/', authMiddleware, dashboard);
routes.post('/', authMiddleware, postDashboard);

export default routes;