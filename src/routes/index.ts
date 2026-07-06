import { Router } from "express";
import authRoute from "../modules/auth/auth.route";

const mainRouter = Router();

const moduleRoutes = [
	{
		path: "/auth",
		route: authRoute,
	},
];

moduleRoutes.forEach((route) => {
	mainRouter.use(route.path, route.route);
});

export default mainRouter;
