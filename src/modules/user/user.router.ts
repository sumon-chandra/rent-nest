import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { usersControllers } from "./user.controller";

const userRoute = Router();

userRoute.get("/", auth(Role.ADMIN), usersControllers.getAllUsers);
userRoute.get("/:userId", auth(Role.ADMIN), usersControllers.getUserById);
userRoute.get("/me", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), usersControllers.getProfile);
userRoute.patch("/update", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), usersControllers.updateProfile);
userRoute.delete("/:userId", auth(Role.ADMIN), usersControllers.deleteUser);

export default userRoute;
