import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utilities/catch-async";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utilities/send-response";

const createProperty = catchAsync(async (req: Request, res: Response) => {
	const property = await propertyService.insertProperty({ ...req.body, landlordId: req.user?.id });

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Property created successfully",
		data: property,
	});
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
	const result = await propertyService.getAllProperties(req.query);
	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Properties retrieved successfully",
		meta: result.meta,
		data: result.data,
	});
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
	const property = await propertyService.getPropertyById(req.params.id);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Property retrieved successfully",
		data: property,
	});
});

const updateProperty = catchAsync(async (req: Request, res: Response) => {
	const property = await propertyService.updateProperty(req.params.id, req.body);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Property updated successfully",
		data: property,
	});
});

const deleteProperty = catchAsync(async (req: Request, res: Response) => {
	const property = await propertyService.deleteProperty(req.params.id);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Property deleted successfully",
		data: property,
	});
});

const getPropertyMetadata = catchAsync(async (req: Request, res: Response) => {
	const metadata = await propertyService.getPropertyMetadata();

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Property metadata retrieved successfully",
		data: metadata,
	});
});

export const propertyController = {
	createProperty,
	getAllProperties,
	getPropertyById,
	updateProperty,
	deleteProperty,
	getPropertyMetadata,
};
