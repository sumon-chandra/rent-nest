import { Router } from "express";
import { authControllers } from "./auth.controller";

const authRoute = Router();

authRoute.post("/register", authControllers.register);

export default authRoute;
