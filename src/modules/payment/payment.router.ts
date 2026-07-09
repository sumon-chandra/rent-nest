import { Router } from "express";
import { paymentControllers } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const paymentRouter = Router();

paymentRouter.post("/checkout/:rentalId", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), paymentControllers.createCheckoutSession);

export default paymentRouter;
