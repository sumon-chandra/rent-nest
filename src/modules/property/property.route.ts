import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { propertyController } from "./property.controller";

const propertyRouter = Router();

propertyRouter.get("/", propertyController.getAllProperties);
propertyRouter.get("/:id", propertyController.getPropertyById);
propertyRouter.post("/", auth(Role.ADMIN, Role.LANDLORD), propertyController.createProperty);
propertyRouter.patch("/:id", auth(Role.ADMIN, Role.LANDLORD), propertyController.updateProperty);
propertyRouter.delete("/:id", auth(Role.ADMIN, Role.LANDLORD), propertyController.deleteProperty);

export default propertyRouter;
