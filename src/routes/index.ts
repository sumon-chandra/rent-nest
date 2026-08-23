import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import categoryRouter from "../modules/category/category.route";
import propertyRouter from "../modules/property/property.route";
import rentalReqRouter from "../modules/rental-requests/rental-request.route";
import paymentRouter from "../modules/payment/payment.router";
import reviewRouter from "../modules/review/review.router";
import userRoute from "../modules/user/user.router";
import adminRouter from "../modules/admin/admin.route";

const mainRouter = Router();

const moduleRoutes = [
	{
		path: "/auth",
		route: authRoute,
	},
	{
		path: "/categories",
		route: categoryRouter,
	},
	{
		path: "/properties",
		route: propertyRouter,
	},
	{
		path: "/rental-requests",
		route: rentalReqRouter,
	},
	{
		path: "/payments",
		route: paymentRouter,
	},
	{
		path: "/reviews",
		route: reviewRouter,
	},
	{
		path: "/users",
		route: userRoute,
	},
	{
		path: "/admin",
		route: adminRouter,
	},
];

moduleRoutes.forEach((route) => {
	mainRouter.use(route.path, route.route);
});

export default mainRouter;
