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

const getAllRentalRequests = async (requestedUserRole: Role, userId: string, query: Record<string, unknown> = {}) => {
	const page = query.page ? Number(query.page) : 1;
	const limit = query.limit ? Number(query.limit) : 10;
	const skip = (page - 1) * limit;

	let where: RentalRequestWhereInput = {};
	if (requestedUserRole === Role.LANDLORD) {
		where = { property: { landlordId: userId } };
	} else if (requestedUserRole === Role.TENANT) {
		where = { tenantId: userId };
	} else {
		where = {};
	}

	if (query.searchTerm) {
		// add search logic if needed, e.g. search by property title
		where.property = {
			...((where.property as any) || {}),
			title: { contains: query.searchTerm as string, mode: "insensitive" },
		};
	}

	const rentalRequests = await prisma.rentalRequest.findMany({
		where,
		skip,
		take: limit,
		orderBy: {
			createdAt: "desc",
		},
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
					id: true,
					title: true,
					description: true,
					price: true,
					status: true,
				},
			},
			payment: {
				select: {
					status: true,
					id: true,
				},
			},
		},
	});

	const total = await prisma.rentalRequest.count({ where });

	return {
		meta: {
			page,
			limit,
			total,
		},
		data: rentalRequests,
	};
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

const getMyProperties = async (tenantId: string) => {
	const rentalRequests = await prisma.rentalRequest.findMany({
		where: { tenantId },
		orderBy: {
			createdAt: "desc"
		},
		include: {
			property: {
				include: {
					landlord: true,
					reviews: {
						where: {
							tenantId,
						},
						select: {
							id: true,
						},
					},
				},
			},
			payment: {
				select: {
					status: true,
					id: true,
				},
			},
		},
	});

	return rentalRequests.map((request) => ({
		id: request.id,
		property: request.property.title,
		propertyId: request.propertyId,
		landlord: request.property.landlord.name,
		dateApplied: request.createdAt.toISOString().split("T")[0],
		status: request.status,
		paymentStatus: request.payment ? request.payment.status : "PENDING",
		paymentId: request.payment ? request.payment.id : null,
		moveInDate: request.moveInDate.toISOString().split("T")[0],
		hasReviewed: request.property.reviews.length > 0,
	}));
};

export const rentalRequestService = {
	createRentalRequest,
	getAllRentalRequests,
	getRentalRequestById,
	updateRentalRequest,
	deleteRentalRequest,
	getMyProperties,
};
