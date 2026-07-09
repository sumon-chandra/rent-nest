import type { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../utilities/app-error.js";
import { Prisma } from "../../generated/prisma/client.js";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.log("Error : ", err);

	let statusCode;
	let errorMessage = err.message || "Internal Server Error.";
	let errorName = err.name || "Internal Server Error.";

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		errorMessage = err.message;
		errorName = err.code;
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		statusCode = httpStatus.BAD_REQUEST;
		errorMessage = "You have provide incorrect fields or missing fields.";
		errorName = err.name;
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		if (err.code === "P2002") {
			statusCode = httpStatus.BAD_REQUEST;
			errorMessage = "Duplicate key found.";
		} else if (err.code === "p2003") {
			statusCode = httpStatus.BAD_REQUEST;
			errorMessage = "Foreign key found.";
		} else if (err.code === "P2025") {
			statusCode = httpStatus.BAD_REQUEST;
			errorMessage = "One or more records were required.";
		}
	} else if (err instanceof Prisma.PrismaClientInitializationError) {
		if (err.errorCode === "P1000") {
			statusCode = httpStatus.UNAUTHORIZED;
			errorMessage = "Authentication failed against database server. Check the database credentials.";
		} else if (err.errorCode === "P1001") {
			statusCode = httpStatus.BAD_REQUEST;
			errorMessage = "Can't reach database server.";
		}
	} else if (err instanceof Prisma.PrismaClientKnownRequestError) {
		statusCode = httpStatus.INTERNAL_SERVER_ERROR;
		errorMessage = "Error occurred during query execution.";
	}

	res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
		success: false,
		statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
		name: errorName,
		message: errorMessage,
		error: err.stack,
	});
};

export default globalErrorHandler;
