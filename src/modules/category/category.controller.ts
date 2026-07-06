import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utilities/catch-async";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utilities/send-response";

const createCategory = catchAsync(async (req: Request, res: Response) => {
	const newCategory = await categoryService.insertCategory(req.body);
	sendResponse(res, {
		success: true,
		message: "Category created successfully",
		statusCode: httpStatus.CREATED,
		data: newCategory,
	});
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
	const categories = await categoryService.getAllCategories();
	sendResponse(res, {
		success: true,
		message: "Categories retrieved successfully",
		statusCode: httpStatus.OK,
		data: categories,
	});
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
	const category = await categoryService.getCategoryById(req.params.id);
	sendResponse(res, {
		success: true,
		message: "Category retrieved successfully",
		statusCode: httpStatus.OK,
		data: category,
	});
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
	const updatedCategory = await categoryService.updateCategory(req.params.id, req.body);
	sendResponse(res, {
		success: true,
		message: "Category updated successfully",
		statusCode: httpStatus.OK,
		data: updatedCategory,
	});
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
	const deletedCategory = await categoryService.deleteCategory(req.params.id);
	sendResponse(res, {
		success: true,
		message: "Category deleted successfully",
		statusCode: httpStatus.OK,
		data: deletedCategory,
	});
});

export const categoryController = {
	createCategory,
	getAllCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
};
