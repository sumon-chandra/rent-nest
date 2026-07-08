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
		},
	});
	return newProperty;
};

const getAllProperties = async (query: PropertyQuery): Promise<Property[]> => {
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
	});
	return properties;
};

const getPropertyById = async (id: string): Promise<Property | null> => {
	const property = await prisma.property.findUnique({
		where: { id },
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

export const propertyService = {
	insertProperty,
	getAllProperties,
	getPropertyById,
	updateProperty,
	deleteProperty,
};
