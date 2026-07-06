import { Router } from "express";
import { usersControllers } from "./users.controller.js";

const usersRoute = Router();

usersRoute.get("/", usersControllers.getAllUsers);
usersRoute.post("/create", usersControllers.createUser);

export default usersRoute;
