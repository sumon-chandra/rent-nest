import httpStatus from "http-status";
import { catchAsync } from "../../utilities/catch-async";
import { sendResponse } from "../../utilities/send-response";
import { rentalRequestService } from "./rental-request.service";
import { Role } from "../../../generated/prisma/enums";

const makeRentalRequest = catchAsync(async (req, res) => {
	const rentalRequestData = req.body;
	const tenantId = req.user?.id;
	const rentalRequest = await rentalRequestService.createRentalRequest({ ...rentalRequestData, tenantId });

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Rental request created successfully",
		data: rentalRequest,
	});
});

const getAllRentalRequests = catchAsync(async (req, res) => {
	const role = req.user?.role as Role;
	const userId = req.user?.id as string;
	const rentalRequests = await rentalRequestService.getAllRentalRequests(role, userId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Rental requests retrieved successfully",
		data: rentalRequests,
	});
});

const getRentalRequestById = catchAsync(async (req, res) => {
	const { id } = req.params;
	const rentalRequest = await rentalRequestService.getRentalRequestById(id);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Rental request retrieved successfully",
		data: rentalRequest,
	});
});

const updateRentalRequest = catchAsync(async (req, res) => {
	const { id } = req.params;
	const rentalRequestData = req.body;
	const tenantId = req.user?.id;
	const rentalRequest = await rentalRequestService.updateRentalRequest(id, { ...rentalRequestData, tenantId });
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Rental request updated successfully",
		data: rentalRequest,
	});
});

const deleteRentalRequest = catchAsync(async (req, res) => {
	const { id } = req.params;
	await rentalRequestService.deleteRentalRequest(id);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Rental request deleted successfully",
		data: null,
	});
});

export const rentalRequestController = {
	makeRentalRequest,
	getAllRentalRequests,
	getRentalRequestById,
	updateRentalRequest,
	deleteRentalRequest,
};
