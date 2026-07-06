import bcrypt from "bcryptjs";
import { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utilities/app-error";
import { jwtUtils } from "../../utilities/jwt";
import envConfigs from "../../configs/env-configs";
import { JwtPayload, SignOptions } from "jsonwebtoken";

const insertUserDataIntoDb = async (dto: Partial<User>) => {
	if (!dto.name || !dto.email || !dto.password) {
		throw AppError.notFound("Missing credentials.");
	}
	const userExists = await prisma.user.findUnique({
		where: { email: dto.email },
	});
	if (userExists) {
		throw AppError.forbidden("User already exists.");
	}
	const hashPass = await bcrypt.hashSync(dto.password, 12);
	const user = await prisma.user.create({
		data: {
			name: dto.name,
			email: dto.email,
			password: hashPass,
			role: dto.role!,
			avatar: dto.avatar,
			phone: dto.phone,
		},
		select: {
			name: true,
			email: true,
			role: true,
			avatar: true,
			phone: true,
		},
	});
	if (!user) {
		throw AppError.internal("Failed to register.");
	}
	return user;
};
interface LoginDto {
	email: string;
	password: string;
}

const userLogin = async ({ email, password }: LoginDto) => {
	if (!email || !password) {
		throw new Error("You must provide email and password");
	}

	const existingUser = await prisma.user.findUniqueOrThrow({
		where: { email },
	});

	const jwtPayload = {
		id: existingUser.id,
		email: existingUser.email,
		role: existingUser.role,
	};

	const accessToken = jwtUtils.createJwt(jwtPayload, envConfigs.jwt.access_secret, envConfigs.jwt.access_expired_in as SignOptions);

	const refreshToken = jwtUtils.createJwt(jwtPayload, envConfigs.jwt.refresh_secret, envConfigs.jwt.refresh_expired_in as SignOptions);

	return {
		accessToken,
		refreshToken,
	};
};

const refreshToken = async (token: string) => {
	if (!token) {
		throw new Error("You must provide refresh token");
	}
	const verifiedToken = jwtUtils.verifyToken(token, envConfigs.jwt.refresh_secret);

	if (!verifiedToken.success) {
		throw new Error(verifiedToken.error);
	}

	const { id } = verifiedToken.data as JwtPayload;

	const user = await prisma.user.findUnique({
		where: {
			id,
		},
	});

	if (!user) {
		throw new Error("User not found. Please log in again.");
	}

	if (user.status === "BANNED") {
		throw new Error("Your account has been banned. Please contact support.");
	}
	const jwtPayload = {
		id: user.id,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createJwt(jwtPayload, envConfigs.jwt.access_secret, envConfigs.jwt.access_expired_in as SignOptions);
	return { accessToken };
};

const getMyProfileFromDB = async (userID: string) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: { id: userID },
		omit: {
			password: true,
		},
	});

	return userData;
};

export const authServices = {
	insertUserDataIntoDb,
	userLogin,
	refreshToken,
	getMyProfileFromDB,
};
