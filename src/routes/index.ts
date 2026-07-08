import { Router } from "express";
import authRoute from "../modules/auth/auth.route";
import categoryRouter from "../modules/category/category.route";
import propertyRouter from "../modules/property/property.route";

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
];

moduleRoutes.forEach((route) => {
	mainRouter.use(route.path, route.route);
});

export default mainRouter;
