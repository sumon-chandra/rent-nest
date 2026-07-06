import { Router } from "express";
import { authControllers } from "./auth.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const authRoute = Router();

authRoute.post("/register", authControllers.register);
authRoute.post("/login", authControllers.login);
authRoute.post("/refresh-token", authControllers.refreshToken);
authRoute.get("/me", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), authControllers.getMyProfile);

export default authRoute;
