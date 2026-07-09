import { prisma } from "../../lib/prisma";
import { UserDto } from "./user.interface";

const getMyProfileFromDB = async (userID: string) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: { id: userID },
		omit: {
			password: true,
		},
	});

	return userData;
};

const updateUserProfile = async (userID: string, profileData: UserDto) => {
	const { name, avatar, phone } = profileData;
	const updatedUser = await prisma.user.update({
		where: { id: userID },
		data: {
			name,
			avatar,
			phone,
		},
		omit: {
			password: true,
		},
	});

	return updatedUser;
};

const getAllUsers = async () => {
	const response = await prisma.user.findMany({
		omit: {
			password: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return response;
};

const getUserById = async (userId: string) => {
	const response = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
	});

	return response;
};

const deleteUser = async (userId: string) => {
	await prisma.user.delete({
		where: { id: userId },
	});
};

export const usersServices = {
	getMyProfileFromDB,
	updateUserProfile,
	getAllUsers,
	deleteUser,
	getUserById,
};
