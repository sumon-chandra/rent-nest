import httpStatus from "http-status";
import { PaymentProvider } from "../../../generated/prisma/enums";
import envConfigs from "../../configs/env-configs";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import AppError from "../../utilities/app-error";
import Stripe from "stripe";
import { paymentUtils } from "./payment.utils";


const createCheckoutSession = async (tenantId: string, rentalId: string) => {
	const rental = await prisma.rentalRequest.findUnique({
		where: { id: rentalId },
		include: { property: true, tenant: true },
	});
	if (!rental) throw AppError.notFound("No pending rental request found.");
	if (rental.tenant.id !== tenantId) {
		throw AppError.conflict("You only make payment in your own rental requests.", "CONFLICT");
	}
	if (rental.status !== "APPROVED") {
		throw AppError.conflict("Your rental request is not in approved mode.", "CONFLICT");
	}

	const payment = await prisma.payment.upsert({
		where: { rentalRequestId: rental.id },
		update: {
			transactionId: crypto.randomUUID().toUpperCase(),
			amount: rental.property.price,
			provider: PaymentProvider.STRIPE,
		},
		create: {
			transactionId: crypto.randomUUID().toUpperCase(),
			rentalRequestId: rental.id,
			amount: rental.property.price,
			provider: PaymentProvider.STRIPE,
		},
	});

	// Stripe calls happen after the DB write is committed
	const customer = await stripe.customers.create({
		email: rental.tenant.email,
		name: rental.tenant.name,
		metadata: { userId: rental.tenant.id },
	});

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		mode: "payment",
		success_url: `${envConfigs.app_url}/payment-success?paymentId=${payment.id}`,
		cancel_url: `${envConfigs.app_url}/payment-cancel`,
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: "bdt",
					product_data: { name: rental.property.title },
					unit_amount: Number(rental.property.price) * 100,
				},
			},
		],
		customer_email: customer.email!,
		metadata: { paymentId: payment.id, rentalId: rental.id },
		payment_intent_data: {
			metadata: { paymentId: payment.id, rentalId: rental.id },
		},
	});

	return session;
};
const handleStripeWebhook = async (payload: Buffer, signature: string) => {
	if (!signature) {
		throw new Error("Missing Stripe Signature");
	}

	const endpointSecret = envConfigs.stripe.webhook_secret;
	console.log("Body type:", typeof payload, "Is Buffer:", Buffer.isBuffer(payload), "Length:", payload?.length);
	const event = await stripe.webhooks.constructEventAsync(payload as any, signature, endpointSecret);
	switch (event.type) {
		case "checkout.session.completed":
			await paymentUtils.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
			break;

		case "checkout.session.expired":
			await paymentUtils.handleCheckoutExpired(event.data.object as Stripe.Checkout.Session);
			break;

		case "payment_intent.payment_failed":
			await paymentUtils.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
			break;
		default:
			break;
	}
};

const getAllPayments = async () => {
	const response = await prisma.payment.findMany();
	if (!response) {
		throw AppError.internal("Failed to retrieve payment list.");
	}
	return response;
};

const getPaymentById = async (paymentId: string) => {
	const response = await prisma.payment.findUniqueOrThrow({
		where: { id: paymentId },
	});

	return response;
};

const getMyPayments = async (tenantId: string) => {
	const response = await prisma.payment.findMany({
		where: {
			rentalRequest: {
				tenantId,
			},
		},
		include: {
			rentalRequest: {
				include: {
					property: {
						select: {
							title: true,
							location: true,
						}
					}
				}
			}
		}
	});
	return response;
};

export const paymentServices = {
	createCheckoutSession,
	handleStripeWebhook,
	getAllPayments,
	getPaymentById,
	getMyPayments,
};
