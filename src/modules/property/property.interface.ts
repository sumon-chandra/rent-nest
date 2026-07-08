import { PropertyStatus } from "../../../generated/prisma/enums";

export interface PropertyQuery {
	search?: string;
	location?: string;
	minPrice?: number;
	maxPrice?: number;
	categoryId?: string;
	bedrooms?: number;
	bathrooms?: number;
	availability?: PropertyStatus;
	limit?: number;
	page?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
