import { Category } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utilities/app-error";

const insertCategory = async ({ name }: Partial<Category>): Promise<Category> => {
	if (!name) {
		throw AppError.badRequest("Category name is required");
	}
	const slug = name.toLowerCase().replace(/\s+/g, "-");
	const newCategory = await prisma.category.create({
		data: {
			name,
			slug,
		},
		include: {
			_count: {
				select: {
					properties: true,
				},
			},
		},
	});
	return newCategory;
};

const getAllCategories = async (): Promise<Category[]> => {
	const categories = await prisma.category.findMany({
		include: {
			_count: {
				select: {
					properties: true,
				},
			},
		},
	});
	return categories;
};

const getCategoryById = async (id: string): Promise<Category | null> => {
	const category = await prisma.category.findUniqueOrThrow({
		where: { id },
		include: {
			_count: {
				select: {
					properties: true,
				},
			},
		},
	});
	return category;
};

const updateCategory = async (id: string, { name }: Partial<Category>): Promise<Category> => {
	if (!name) {
		throw AppError.badRequest("Category name is required");
	}
	const slug = name.toLowerCase().replace(/\s+/g, "-");
	const updatedCategory = await prisma.category.update({
		where: { id },
		data: {
			name,
			slug,
		},
		include: {
			_count: {
				select: {
					properties: true,
				},
			},
		},
	});
	return updatedCategory;
};

const deleteCategory = async (id: string) => {
	await prisma.category.delete({
		where: { id },
	});
};

export const categoryService = {
	insertCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
};
