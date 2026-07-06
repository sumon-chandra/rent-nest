import { Router } from "express";
import { authControllers } from "./auth.controller";

const authRoute = Router();

authRoute.post("/register", authControllers.register);
authRoute.post("/login", authControllers.login);
authRoute.post("/refresh-token", authControllers.refreshToken);

export default authRoute;
