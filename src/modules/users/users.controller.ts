import { Request, Response } from "express";
import { usersServices } from "./users.service.js";
import sendResponse from "../../utilities/send-response.js";
import status from "http-status";

const getAllUsers = async (req: Request, res: Response) => {
	const response = await usersServices.getAllUsers();

	sendResponse(res, {
		statusCode: status.OK,
		success: true,
		message: "Users retrieved successfully.",
		data: response,
	});
};

const createUser = async (req: Request, res: Response) => {
	const response = await usersServices.insertUserIntoDb();

	sendResponse(res, {
		statusCode: status.CREATED,
		success: true,
		message: "User created successfully.",
		data: response,
	});
};

export const usersControllers = {
	getAllUsers,
	createUser,
};
