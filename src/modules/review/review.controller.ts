import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utilities/catch-async";
import { reviewServices } from "./review.service";
import { sendResponse } from "../../utilities/send-response";

const addReview = catchAsync(async (req: Request, res: Response) => {
	const tenantId = req.user?.id as string;
	const payload = { ...req.body, tenantId };
	const response = await reviewServices.addReview(payload);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Review added.",
		data: response,
	});
});

const propertyReviews = catchAsync(async (req: Request, res: Response) => {
	const propertyId = req.params.propertyId as string;
	const response = await reviewServices.getPropertyReviews(propertyId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Reviews for property.",
		data: response,
	});
});

const deleteReview = catchAsync(async (req: Request, res: Response) => {
	const propertyId = req.params.propertyId as string;
	await reviewServices.deleteReview(propertyId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Review deleted.",
		data: null,
	});
});

export const reviewControllers = {
	addReview,
	propertyReviews,
	deleteReview,
};
