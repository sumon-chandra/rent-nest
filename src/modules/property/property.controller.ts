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

const getLandlordProperties = catchAsync(async (req: Request, res: Response) => {
	const landlordId = req.user?.id;

	const result = await propertyService.getLandlordProperties(landlordId!);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Landlord properties retrieved successfully",
		meta: result.meta,
		data: result.data,
	});
});

const addFavorite = catchAsync(async (req: Request, res: Response) => {
	const tenantId = req.user?.id as string;
	const { propertyId } = req.body;
	const favorite = await propertyService.addFavorite(tenantId, propertyId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.CREATED,
		message: "Property added to favorites.",
		data: favorite,
	});
});

const getFavorites = catchAsync(async (req: Request, res: Response) => {
	const tenantId = req.user?.id as string;
	const favorites = await propertyService.getFavoriteProperties(tenantId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Favorite properties retrieved successfully.",
		data: favorites,
	});
});

const removeFavorite = catchAsync(async (req: Request, res: Response) => {
	const tenantId = req.user?.id as string;
	const { id } = req.params;
	await propertyService.removeFavorite(tenantId, id);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Property removed from favorites.",
		data: null,
	});
});

export const propertyController = {
	createProperty,
	getAllProperties,
	getPropertyById,
	updateProperty,
	deleteProperty,
	getPropertyMetadata,
	getLandlordProperties,
	addFavorite,
	getFavorites,
	removeFavorite,
};
