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

export const authControllers = {
	register,
};
