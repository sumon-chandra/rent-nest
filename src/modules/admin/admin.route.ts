import { Router } from "express";
import { adminControllers } from "./admin.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();

// Protect all admin routes with auth and ADMIN role
router.use(auth(Role.ADMIN));

router.get("/statistics", adminControllers.getGlobalStatistics);
router.patch("/users/:id/status", adminControllers.changeUserStatus);
router.patch("/properties/:id/status", adminControllers.changePropertyStatus);
router.delete("/reviews/:id", adminControllers.deleteReview);

export default router;
