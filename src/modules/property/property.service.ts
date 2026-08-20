import { Property, PropertyStatus } from "../../../generated/prisma/client";
import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import AppError from "../../utilities/app-error";
import { PropertyQuery } from "./property.interface";

const insertProperty = async (dto: Partial<Property>): Promise<Property> => {
	if (
		!dto.title ||
		!dto.description ||
		!dto.price ||
		!dto.bathrooms ||
		!dto.bedrooms ||
		!dto.area ||
		!dto.categoryId ||
		!dto.location ||
		!dto.landlordId
	) {
		throw AppError.badRequest("Missing required fields.");
	}
	const newProperty = await prisma.property.create({
		data: {
			title: dto.title,
			description: dto.description,
			price: dto.price,
			bathrooms: dto.bathrooms,
			bedrooms: dto.bedrooms,
			area: dto.area,
			categoryId: dto.categoryId,
			location: dto.location,
			landlordId: dto.landlordId,
			amenities: dto.amenities,
			rating: dto.rating,
			isFeatured: dto.isFeatured,
			status: dto.status,
			images: dto.images,
			thumbnail: dto.thumbnail,
		},
	});
	return newProperty;
};

const getAllProperties = async (query: PropertyQuery) => {
	const limit = query.limit ? Number(query.limit) : 10;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;
	const sortby = query.sortBy ? query.sortBy : "createdAt";
	const sortOrder = query.sortOrder ? query.sortOrder : "desc";

	let andConditions: PropertyWhereInput[] = [];

	if (query.search) {
		andConditions.push({
			OR: [
				{
					title: {
						contains: query.search,
						mode: "insensitive",
					},
				},
				{
					description: {
						contains: query.search,
						mode: "insensitive",
					},
				},
			],
		});
	}
	if (query.location) {
		andConditions.push({
			location: {
				contains: query.location,
				mode: "insensitive",
			},
		});
	}

	if (query.availability) {
		andConditions.push({
			status: query.availability,
		});
	}

	if (query.bathrooms) {
		andConditions.push({
			bathrooms: query.bathrooms,
		});
	}

	if (query.bedrooms) {
		andConditions.push({
			bedrooms: query.bedrooms,
		});
	}

	if (query.categoryId) {
		andConditions.push({
			categoryId: query.categoryId,
		});
	}

	if (query.minPrice) {
		andConditions.push({
			price: {
				gte: query.minPrice,
			},
		});
	}

	if (query.maxPrice) {
		andConditions.push({
			price: {
				lte: query.maxPrice,
			},
		});
	}

	const properties = await prisma.property.findMany({
		where: {
			AND: andConditions,
		},
		take: limit,
		skip: skip,
		orderBy: {
			[sortby]: sortOrder,
		},
		include: {
			category: {
				select: {
					name: true,
					id: true,
				},
			},
			landlord: {
				select: {
					name: true,
					id: true,
					email: true,
					avatar: true,
				},
			},
			_count: {
				select: {
					reviews: true,
					favoriteProperties: true,
				},
			},
		},
	});
	const total = await prisma.property.count({
		where: {
			AND: andConditions,
		},
	});

	const metadata = await getPropertyMetadata();

	return {
		meta: {
			page,
			limit,
			total,
			...metadata,
		},
		data: properties,
	};
};

const getPropertyById = async (id: string) => {
	const property = await prisma.property.findUnique({
		where: { id },
		include: {
			category: {
				select: {
					name: true,
					id: true,
				},
			},
			landlord: {
				select: {
					name: true,
					id: true,
					email: true,
					avatar: true,
				},
			},
			reviews: {
				select: {
					id: true,
					comment: true,
					rating: true,
					createdAt: true,
					tenant: {
						select: {
							name: true,
							id: true,
							email: true,
							avatar: true,
						},
					},
				},
			},
			_count: {
				select: {
					reviews: true,
					favoriteProperties: true,
				},
			},
		},
	});
	return property;
};

const updateProperty = async (id: string, dto: Partial<Property>): Promise<Property> => {
	const updatedProperty = await prisma.property.update({
		where: { id },
		data: dto,
	});
	return updatedProperty;
};

const deleteProperty = async (id: string): Promise<Property> => {
	const deletedProperty = await prisma.property.delete({
		where: { id },
	});
	return deletedProperty;
};

const getPropertyMetadata = async () => {
	const totalProperties = await prisma.property.count();
	
	const aggregate = await prisma.property.aggregate({
		_min: { price: true },
		_max: { price: true },
	});

	const mostReviewed = await prisma.property.findFirst({
		orderBy: {
			reviews: {
				_count: "desc",
			},
		},
		include: {
			_count: {
				select: { reviews: true, favoriteProperties: true },
			},
		},
	});

	const mostFavorites = await prisma.property.findFirst({
		orderBy: {
			favoriteProperties: {
				_count: "desc",
			},
		},
		include: {
			_count: {
				select: { reviews: true, favoriteProperties: true },
			},
		},
	});

	return {
		totalProperties,
		minPrice: aggregate._min.price,
		maxPrice: aggregate._max.price,
		mostReviewed,
		mostFavorites,
	};
};

const getLandlordProperties = async (landlordId: string) => {
	if (!landlordId) {
		throw AppError.badRequest("Landlord not found");
	}
	const properties = await prisma.property.findMany({
		where: { landlordId },
		include: {
			category: {
				select: {
					name: true,
					id: true,
				},
			},
			landlord: {
				select: {
					name: true,
					id: true,
					email: true,
					avatar: true,
				},
			},
			_count: {
				select: {
					reviews: true,
					favoriteProperties: true,
					rentalRequests: {
						where: {
							status: {
								in: ["APPROVED", "COMPLETED"],
							},
						},
					},
				},
			},
			rentalRequests: {
				select: {
					createdAt: true,
					status: true,
					payment: {
						select: {
							amount: true,
							status: true,
						},
					},
				},
			},
		},
	});

	let totalRevenue = 0;
	let activeProperties = 0;
	let totalBookingsThisMonth = 0;

	const currentMonth = new Date().getMonth();
	const currentYear = new Date().getFullYear();

	const formattedProperties = properties.map((property) => {
		if (property.status === "AVAILABLE" || property.status === "RENTED") {
			activeProperties += 1;
		}

		const revenue = property.rentalRequests.reduce((sum, request) => {
			// Check if booking is this month
			if (
				(request.status === "APPROVED" || request.status === "COMPLETED") &&
				request.createdAt.getMonth() === currentMonth &&
				request.createdAt.getFullYear() === currentYear
			) {
				totalBookingsThisMonth += 1;
			}

			if (request.payment?.status === "COMPLETED") {
				return sum + Number(request.payment.amount || 0);
			}
			return sum;
		}, 0);

		totalRevenue += revenue;

		const { rentalRequests, ...rest } = property;

		return {
			...rest,
			revenue,
		};
	});

	const recentBookings = await prisma.rentalRequest.findMany({
		where: {
			property: {
				landlordId: landlordId,
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		take: 5,
		include: {
			property: {
				select: {
					id: true,
					title: true,
					thumbnail: true,
					location: true,
					status: true,
					price: true,
				},
			},
			tenant: {
				select: {
					name: true,
					email: true,
					avatar: true,
				},
			},
			payment: {
				select: {
					amount: true,
					status: true,
					createdAt: true,
					paidAt: true,
				},
			},
		},
	});

	return {
		data: formattedProperties,
		meta: {
			totalRevenue,
			activeProperties,
			totalBookingsThisMonth,
			recentBookings,
		},
	};
};

const addFavorite = async (tenantId: string, propertyId: string) => {
	const isExists = await prisma.favoriteProperties.findFirst({
		where: {
			tenantId,
			propertyId,
		},
	});
	if (isExists) {
		throw AppError.badRequest("Property is already in your favorites.");
	}
	const favorite = await prisma.favoriteProperties.create({
		data: {
			tenantId,
			propertyId,
		},
	});
	return favorite;
};

const getFavoriteProperties = async (tenantId: string) => {
	const favorites = await prisma.favoriteProperties.findMany({
		where: {
			tenantId,
		},
		include: {
			property: true,
		},
	});
	return favorites
};

const removeFavorite = async (tenantId: string, favoriteId: string) => {
	const favorite = await prisma.favoriteProperties.findUnique({
		where: { id: favoriteId },
	});
	if (!favorite) {
		throw AppError.notFound("Favorite property not found.");
	}
	if (favorite.tenantId !== tenantId) {
		throw AppError.badRequest("You are not authorized to remove this favorite.");
	}
	await prisma.favoriteProperties.delete({
		where: { id: favoriteId },
	});
};

export const propertyService = {
	insertProperty,
	getAllProperties,
	getPropertyById,
	updateProperty,
	deleteProperty,
	getPropertyMetadata,
	getLandlordProperties,
	addFavorite,
	getFavoriteProperties,
	removeFavorite,
};
