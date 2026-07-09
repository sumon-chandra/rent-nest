import { PaymentProvider, RentalRequestStatus } from "../../../generated/prisma/enums";
import envConfigs from "../../configs/env-configs";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import AppError from "../../utilities/app-error";

const createCheckoutSession = async (tenantId: string, rentalId: string) => {
	const response = await prisma.$transaction(async (tx) => {
		const rental = await tx.rentalRequest.findUnique({
			where: {
				id: rentalId,
				tenantId: tenantId,
				status: RentalRequestStatus.PENDING,
			},
			include: {
				property: true,
				tenant: true,
			},
		});
		if (!rental) {
			throw AppError.notFound("No pending rental request found.");
		}
		const customer = await stripe.customers.create({
			email: rental.tenant.email,
			name: rental.tenant.name,
			metadata: {
				userId: rental.tenant.id,
			},
		});
		const payment = await tx.payment.upsert({
			where: {
				rentalRequestId: rental.id,
			},
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
						product_data: {
							name: rental.property.title,
						},
						unit_amount: Number(rental.property.price) * 100,
					},
				},
			],
			customer_email: customer.email!,
			metadata: {
				paymentId: payment.id,
				rentalId: rental.id,
			},
		});

		return session;
	});

	return response;
};

export const paymentServices = {
	createCheckoutSession,
};
