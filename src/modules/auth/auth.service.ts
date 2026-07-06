import bcrypt from "bcryptjs";
import { User } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utilities/app-error";

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
const manageLogin = async () => {};

export const authServices = {
	insertUserDataIntoDb,
	manageLogin,
};
