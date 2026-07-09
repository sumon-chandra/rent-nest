import { Router } from "express";
import { reviewControllers } from "./review.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const reviewRouter = Router();

reviewRouter.get("/properties/:propertyId", reviewControllers.propertyReviews);
reviewRouter.post("/", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), reviewControllers.addReview);
reviewRouter.patch("/:reviewId", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), reviewControllers.updateReview);
reviewRouter.delete("/:reviewId", auth(Role.ADMIN, Role.LANDLORD, Role.TENANT), reviewControllers.deleteReview);

export default reviewRouter;
