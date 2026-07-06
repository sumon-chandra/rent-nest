import httpStatus from "http-status";
import { type Request, type Response } from "express";
import { catchAsync } from "../../utilities/catch-async";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utilities/send-response";

const register = catchAsync(async (req: Request, res: Response) => {
	const response = await authServices.insertUserDataIntoDb(req.body);

	sendResponse(res, {
		success: true,
		message: "User login successfully.",
		statusCode: httpStatus.OK,
		data: response,
	});
});

const login = catchAsync(async (req: Request, res: Response) => {
	const { accessToken, refreshToken } = await authServices.userLogin(req.body);

	res.cookie("access_token", accessToken, {
		httpOnly: true,
		secure: false,
		maxAge: 1000 * 60 * 60 * 24 * 1,
		sameSite: "none",
	});

	res.cookie("refresh_token", refreshToken, {
		httpOnly: true,
		secure: false,
		maxAge: 1000 * 60 * 60 * 24 * 1,
		sameSite: "none",
	});

	sendResponse(res, {
		success: true,
		message: "User login successfully.",
		statusCode: httpStatus.OK,
		data: { accessToken, refreshToken },
	});
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	const { refresh_token } = req.cookies;

	const response = await authServices.refreshToken(refresh_token);

	res.cookie("access_token", response.accessToken, {
		httpOnly: true,
		secure: false,
		maxAge: 1000 * 60 * 60 * 24 * 1,
		sameSite: "none",
	});

	sendResponse(res, {
		success: true,
		message: "Token refreshed successfully.",
		statusCode: httpStatus.OK,
		data: response,
	});
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
	const userID = req.user?.id as string;
	const userData = await authServices.getMyProfileFromDB(userID);

	sendResponse(res, {
		success: true,
		message: "Profile retrieved successfully.",
		statusCode: httpStatus.OK,
		data: userData,
	});
});

export const authControllers = {
	register,
	login,
	refreshToken,
	getMyProfile,
};
