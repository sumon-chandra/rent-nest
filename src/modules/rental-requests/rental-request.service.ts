import { Role } from "../../../generated/prisma/enums";
import { RentalRequestWhereInput } from "../../../generated/prisma/models";
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

const getAllRentalRequests = async (requestedUserRole: Role, userId: string) => {
	console.log({ requestedUserRole, userId });
	let where: RentalRequestWhereInput = {};
	if (requestedUserRole === Role.LANDLORD) {
		where = { property: { landlordId: userId } };
	} else if (requestedUserRole === Role.TENANT) {
		where = { tenantId: userId };
	} else {
		where = {};
	}

	const rentalRequests = await prisma.rentalRequest.findMany({
		where,
		include: {
			tenant: {
				select: {
					id: true,
					name: true,
					email: true,
					avatar: true,
					phone: true,
				},
			},
			property: {
				select: {
					title: true,
					description: true,
					price: true,
					status: true,
				},
			},
		},
	});
	return rentalRequests;
};

const getRentalRequestById = async (id: string) => {
	const rentalRequest = await prisma.rentalRequest.findUnique({
		where: { id },
		include: {
			tenant: {
				select: {
					id: true,
					name: true,
					email: true,
					avatar: true,
					phone: true,
				},
			},
			property: {
				select: {
					title: true,
					description: true,
					price: true,
					status: true,
				},
			},
		},
	});
	if (!rentalRequest) {
		throw AppError.notFound("Rental request not found");
	}
	return rentalRequest;
};

const updateRentalRequest = async (id: string, rentalRequestData: Partial<RentalRequestData>) => {
	const rentalRequest = await prisma.rentalRequest.update({
		where: { id },
		data: {
			status: rentalRequestData.status,
		},
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
