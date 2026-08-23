import type { Request, Response } from "express";
import { catchAsync } from "../../utilities/catch-async";
import { adminServices } from "./admin.service";
import { sendResponse } from "../../utilities/send-response";

const getGlobalStatistics = catchAsync(async (req: Request, res: Response) => {
	const result = await adminServices.getGlobalStatistics();
	sendResponse(res, {
		success: true,
		statusCode: 200,
		message: "Global statistics retrieved successfully",
		data: result,
	});
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;
	const result = await adminServices.changeUserStatus(id, status);
	sendResponse(res, {
		success: true,
		statusCode: 200,
		message: "User status updated successfully",
		data: result,
	});
});

const changePropertyStatus = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const { status } = req.body;
	const result = await adminServices.changePropertyStatus(id, status);
	sendResponse(res, {
		success: true,
		statusCode: 200,
		message: "Property status updated successfully",
		data: result,
	});
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await adminServices.deleteReview(id);
	sendResponse(res, {
		success: true,
		statusCode: 200,
		message: "Review deleted successfully",
		data: result,
	});
});

export const adminControllers = {
	getGlobalStatistics,
	changeUserStatus,
	changePropertyStatus,
	deleteReview,
};
