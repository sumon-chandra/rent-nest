import { prisma } from "../../lib/prisma";
import { UserDto } from "./user.interface";
import { RentalRequestStatus, PaymentStatus } from "../../../generated/prisma/enums";

const getMyProfileFromDB = async (userID: string) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: { id: userID },
		omit: {
			password: true,
		},
	});

	return userData;
};

const updateUserProfile = async (userID: string, profileData: UserDto) => {
	const { name, avatar, phone } = profileData;
	const updatedUser = await prisma.user.update({
		where: { id: userID },
		data: {
			name,
			avatar,
			phone,
		},
		omit: {
			password: true,
		},
	});

	return updatedUser;
};

const getAllUsers = async (query: Record<string, unknown>) => {
	const { searchTerm, page = 1, limit = 10 } = query;
	const skip = (Number(page) - 1) * Number(limit);
	
	const whereCondition: any = searchTerm
		? {
				OR: [
					{ name: { contains: searchTerm as string, mode: "insensitive" } },
					{ email: { contains: searchTerm as string, mode: "insensitive" } },
				],
		  }
		: {};

	const response = await prisma.user.findMany({
		where: whereCondition,
		skip,
		take: Number(limit),
		orderBy: { createdAt: "desc" },
		omit: {
			password: true,
			updatedAt: true,
		},
	});

	const total = await prisma.user.count({ where: whereCondition });

	return {
		meta: {
			page: Number(page),
			limit: Number(limit),
			total,
		},
		data: response,
	};
};

const getUserById = async (userId: string) => {
	const response = await prisma.user.findUniqueOrThrow({
		where: { id: userId },
	});

	return response;
};

const deleteUser = async (userId: string) => {
	await prisma.user.delete({
		where: { id: userId },
	});
};

const getTenantDashboardStats = async (tenantId: string) => {
	const totalBooked = await prisma.rentalRequest.count({
		where: {
			tenantId,
			status: { in: [RentalRequestStatus.APPROVED, RentalRequestStatus.COMPLETED] },
		},
	});

	const totalPendingRequests = await prisma.rentalRequest.count({
		where: {
			tenantId,
			status: RentalRequestStatus.PENDING,
		},
	});

	const totalSavedProperties = await prisma.favoriteProperties.count({
		where: { tenantId },
	});

	const payments = await prisma.payment.aggregate({
		where: {
			rentalRequest: { tenantId },
			status: PaymentStatus.COMPLETED,
		},
		_sum: {
			amount: true,
		},
	});
	const totalInvestedAmount = Number(payments._sum.amount || 0);

	const latestRentalRequests = await prisma.rentalRequest.findMany({
		where: { tenantId },
		orderBy: { createdAt: "desc" },
		take: 5,
		include: {
			property: {
				select: {
					title: true,
					price: true,
					location: true,
				},
			},
			payment: {
				select: {
					status: true,
					id: true,
				},
			},
		},
	});

	const formattedLatestRequests = latestRentalRequests.map((req) => ({
		...req,
		paymentStatus: req.payment ? req.payment.status : "PENDING",
	}));

	return {
		totalBooked,
		totalPendingRequests,
		totalSavedProperties,
		totalInvestedAmount,
		latestRentalRequests: formattedLatestRequests,
	};
};

export const usersServices = {
	getMyProfileFromDB,
	updateUserProfile,
	getAllUsers,
	deleteUser,
	getUserById,
	getTenantDashboardStats,
};
