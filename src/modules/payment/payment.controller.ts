import httpStatus from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../../utilities/catch-async";
import { paymentServices } from "./payment.service";
import { sendResponse } from "../../utilities/send-response";

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
	const tenantId = req.user?.id as string;
	const rentalId = req.params.rentalId as string;
	const session = await paymentServices.createCheckoutSession(tenantId, rentalId);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Checkout session created.",
		data: session.url,
	});
});

const stripeWebhook = catchAsync(async (req: Request, res: Response) => {
	const event = req.body as Buffer;
	const signature = req.headers["stripe-signature"] as string;

	await paymentServices.handleStripeWebhook(event, signature);

	sendResponse(res, {
		success: true,
		statusCode: httpStatus.OK,
		message: "Stripe webhook triggered.",
		data: null,
	});
});

export const paymentControllers = {
	createCheckoutSession,
	stripeWebhook,
};
