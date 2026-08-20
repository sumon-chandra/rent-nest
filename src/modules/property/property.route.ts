import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";
import { propertyController } from "./property.controller";

const propertyRouter = Router();

propertyRouter.get("/", propertyController.getAllProperties);
propertyRouter.get("/metadata", propertyController.getPropertyMetadata);
propertyRouter.get("/my-properties", auth(Role.LANDLORD), propertyController.getLandlordProperties);

propertyRouter.post("/favorites", auth(Role.TENANT), propertyController.addFavorite);
propertyRouter.get("/favorites", auth(Role.TENANT), propertyController.getFavorites);
propertyRouter.delete("/favorites/:id", auth(Role.TENANT), propertyController.removeFavorite);

propertyRouter.get("/:id", propertyController.getPropertyById);
propertyRouter.post("/", auth(Role.ADMIN, Role.LANDLORD), propertyController.createProperty);
propertyRouter.patch("/:id", auth(Role.ADMIN, Role.LANDLORD), propertyController.updateProperty);
propertyRouter.delete("/:id", auth(Role.ADMIN, Role.LANDLORD), propertyController.deleteProperty);

export default propertyRouter;
