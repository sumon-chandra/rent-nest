import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const categoryRouter = Router();

categoryRouter.post("/", auth(Role.ADMIN), categoryController.createCategory);
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/:id", auth(Role.TENANT, Role.LANDLORD, Role.ADMIN), categoryController.getCategoryById);
categoryRouter.patch("/:id", auth(Role.ADMIN), categoryController.updateCategory);
categoryRouter.delete("/:id", auth(Role.ADMIN), categoryController.deleteCategory);

export default categoryRouter;
