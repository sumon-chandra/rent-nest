import type { NextFunction, Request, Response } from "express";
import { jwtUtils } from "../utilities/jwt";
import type { JwtPayload } from "jsonwebtoken";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utilities/catch-async";
import { prisma } from "../lib/prisma";
import envConfigs from "../configs/env-configs";

export const auth = (...requiredRoles: Role[]) => {
	return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
		const token = req.headers.authorization;

		if (!token) {
			throw new Error("You are not logged in. Please log in to access this resource.");
		}

		const verifiedToken = jwtUtils.verifyToken(token, envConfigs.jwt.access_secret);

		if (!verifiedToken.success) {
			throw new Error(verifiedToken.error);
		}

		const { email, name, id, role } = verifiedToken.data as JwtPayload;

		if (requiredRoles.length && !requiredRoles.includes(role)) {
			throw new Error("Forbidden. You don't have permission to access this resource.");
		}

		const user = await prisma.user.findUnique({
			where: {
				id,
				email,
				name,
				role,
			},
		});

		if (!user) {
			throw new Error("User not found. Please log in again.");
		}

		if (user.status === "BANNED") {
			throw new Error("Your account has been banned. Please contact support.");
		}

		req.user = {
			email,
			id,
			role,
		};

		next();
	});
};
