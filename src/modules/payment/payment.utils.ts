import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import AppError from "../../utilities/app-error";
import { PaymentStatus, RentalRequestStatus } from "../../../generated/prisma/enums";

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
	const paymentId = session.metadata?.paymentId;

	if (!paymentId) {
		throw AppError.notFound("Payment ID not found.");
	}

	const payment = await prisma.payment.findUnique({
		where: {
			id: paymentId,
		},
	});

	if (!payment) {
		throw new Error("Payment not found.");
	}

	if (payment.status === PaymentStatus.COMPLETED) {
		return;
	}

	await prisma.$transaction(async (tx) => {
		await tx.payment.update({
			where: {
				id: payment.id,
			},
			data: {
				status: PaymentStatus.COMPLETED,
				paidAt: new Date(),

				transactionId: session.payment_intent?.toString() ?? payment.transactionId,
			},
		});

		await tx.rentalRequest.update({
			where: {
				id: payment.rentalRequestId,
			},
			data: {
				status: RentalRequestStatus.COMPLETED,
			},
		});
	});
};

const handleCheckoutExpired = async (session: Stripe.Checkout.Session) => {
	const paymentId = session.metadata?.paymentId;

	if (!paymentId) {
		throw AppError.notFound("Payment ID not found.");
	}

	await prisma.payment.update({
		where: {
			id: paymentId,
		},
		data: {
			status: PaymentStatus.FAILED,
		},
	});
};

const handlePaymentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
	const paymentId = paymentIntent.metadata?.paymentId;

	if (!paymentId) {
		throw AppError.notFound("Payment ID not found.");
	}

	await prisma.payment.update({
		where: {
			id: paymentId,
		},
		data: {
			status: PaymentStatus.FAILED,
		},
	});
};

export const paymentUtils = {
	handleCheckoutCompleted,
	handleCheckoutExpired,
	handlePaymentFailed,
};
