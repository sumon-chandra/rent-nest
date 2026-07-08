import { Router } from "express";
import { rentalRequestController } from "./rental-request.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const rentalReqRouter = Router();

rentalReqRouter.post("/", auth(Role.TENANT), rentalRequestController.makeRentalRequest);
rentalReqRouter.get("/", auth(Role.ADMIN), rentalRequestController.getAllRentalRequests);
rentalReqRouter.get("/:id", auth(Role.ADMIN, Role.TENANT, Role.LANDLORD), rentalRequestController.getRentalRequestById);
rentalReqRouter.patch("/:id", auth(Role.LANDLORD), rentalRequestController.updateRentalRequest);
rentalReqRouter.delete("/:id", auth(Role.ADMIN), rentalRequestController.deleteRentalRequest);

export default rentalReqRouter;
