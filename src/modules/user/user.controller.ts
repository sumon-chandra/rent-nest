import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utilities/catch-async";
import { usersServices } from "./user.service";
import { sendResponse } from "../../utilities/send-response";

const getProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.id;
	const response = await usersServices.getMyProfileFromDB(userId);

	sendResponse(res, {
		success: true,
		message: "Retrieved user profile",
		statusCode: httpStatus.OK,
		data: response,
	});
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params.userId;
	const response = await usersServices.getMyProfileFromDB(userId);

	sendResponse(res, {
		success: true,
		message: "Retrieved user by ID",
		statusCode: httpStatus.OK,
		data: response,
	});
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user!.id;
	const profileData = req.body;
	const response = await usersServices.updateUserProfile(userId, profileData);

	sendResponse(res, {
		success: true,
		message: "User profile updated",
		statusCode: httpStatus.OK,
		data: response,
	});
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
	const response = await usersServices.getAllUsers();

	sendResponse(res, {
		success: true,
		message: "All users retrieved.",
		statusCode: httpStatus.OK,
		data: response,
	});
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
	const userId = req.params.userId as string;
	await usersServices.deleteUser(userId);

	sendResponse(res, {
		success: true,
		message: "User deleted successfully.",
		statusCode: httpStatus.OK,
		data: null,
	});
});

export const usersControllers = {
	getAllUsers,
	getProfile,
	deleteUser,
	updateProfile,
	getUserById,
};
