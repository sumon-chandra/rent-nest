import { prisma } from "../../lib/prisma";
import { UserStatus, PropertyStatus } from "../../../generated/prisma/enums";

export const adminServices = {
	getGlobalStatistics: async () => {
		// Users Statistics
		const totalUsers = await prisma.user.count();
		const usersByRole = await prisma.user.groupBy({
			by: ["role"],
			_count: {
				role: true,
			},
		});
		const usersByStatus = await prisma.user.groupBy({
			by: ["status"],
			_count: {
				status: true,
			},
		});

		// Properties Statistics
		const totalProperties = await prisma.property.count();
		const propertiesByStatus = await prisma.property.groupBy({
			by: ["status"],
			_count: {
				status: true,
			},
		});

		// Financial Statistics
		const completedPayments = await prisma.payment.aggregate({
			_sum: {
				amount: true,
			},
			where: {
				status: "COMPLETED",
			},
		});
		const paymentsByStatus = await prisma.payment.groupBy({
			by: ["status"],
			_count: {
				status: true,
			},
		});

		// Rental Requests Statistics
		const totalRentalRequests = await prisma.rentalRequest.count();
		const requestsByStatus = await prisma.rentalRequest.groupBy({
			by: ["status"],
			_count: {
				status: true,
			},
		});

		// Reviews
		const totalReviews = await prisma.review.count();

		return {
			users: {
				total: totalUsers,
				byRole: usersByRole.map((item) => ({ role: item.role, count: item._count.role })),
				byStatus: usersByStatus.map((item) => ({ status: item.status, count: item._count.status })),
			},
			properties: {
				total: totalProperties,
				byStatus: propertiesByStatus.map((item) => ({ status: item.status, count: item._count.status })),
			},
			financials: {
				totalRevenue: completedPayments._sum.amount || 0,
				byStatus: paymentsByStatus.map((item) => ({ status: item.status, count: item._count.status })),
			},
			rentalRequests: {
				total: totalRentalRequests,
				byStatus: requestsByStatus.map((item) => ({ status: item.status, count: item._count.status })),
			},
			engagement: {
				totalReviews,
			},
		};
	},

	changeUserStatus: async (userId: string, status: UserStatus) => {
		const user = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				status,
			},
		});
		return user;
	},

	changePropertyStatus: async (propertyId: string, status: PropertyStatus) => {
		const property = await prisma.property.update({
			where: {
				id: propertyId,
			},
			data: {
				status,
			},
		});
		return property;
	},

	deleteReview: async (reviewId: string) => {
		const review = await prisma.review.delete({
			where: {
				id: reviewId,
			},
		});
		return review;
	},
};
