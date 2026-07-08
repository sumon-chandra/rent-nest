import { prisma } from "../../lib/prisma";
import AppError from "../../utilities/app-error";
import { RentalRequestData } from "./rental-request.interface";

const createRentalRequest = async (rentalRequestData: RentalRequestData) => {
	const rentalMoveInDate = new Date(rentalRequestData.moveInDate);

	if (isNaN(rentalMoveInDate.getTime())) {
		throw AppError.badRequest("Invalid date format. Please use a valid date string (e.g., YYYY-MM-DD)");
	}

	if (rentalMoveInDate < new Date()) {
		throw AppError.badRequest("Move-in date cannot be in the past");
	}
	const isExists = await prisma.rentalRequest.findFirst({
		where: {
			tenantId: rentalRequestData.tenantId,
			propertyId: rentalRequestData.propertyId,
		},
	});
	if (isExists) {
		throw AppError.badRequest("You already make the rental request for this property.");
	}
	const rentalRequest = await prisma.rentalRequest.create({
		data: {
			tenantId: rentalRequestData.tenantId,
			propertyId: rentalRequestData.propertyId,
			message: rentalRequestData.message,
			moveInDate: rentalMoveInDate,
		},
	});
	return rentalRequest;
};

const getAllRentalRequests = async () => {
	const rentalRequests = await prisma.rentalRequest.findMany();
	return rentalRequests;
};

const getRentalRequestById = async (id: string) => {
	const rentalRequest = await prisma.rentalRequest.findUnique({
		where: { id },
	});
	if (!rentalRequest) {
		throw AppError.notFound("Rental request not found");
	}
	return rentalRequest;
};

const updateRentalRequest = async (id: string, rentalRequestData: Partial<RentalRequestData>) => {
	const rentalRequest = await prisma.rentalRequest.update({
		where: { id },
		data: rentalRequestData,
	});
	if (!rentalRequest) {
		throw AppError.notFound("Rental request not found");
	}
	return rentalRequest;
};

const deleteRentalRequest = async (id: string) => {
	await prisma.rentalRequest.delete({
		where: { id },
	});
};

export const rentalRequestService = {
	createRentalRequest,
	getAllRentalRequests,
	getRentalRequestById,
	updateRentalRequest,
	deleteRentalRequest,
};
