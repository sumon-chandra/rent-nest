import { Review } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import AppError from "../../utilities/app-error";
import { ReviewDto } from "./review.interface";

const addReview = async ({ tenantId, propertyId, comment, rating }: Review) => {
	if (!rating || isNaN(Number(rating))) {
		throw AppError.badRequest("Rating is required.");
	}
	const calculateRating = Number(rating) > 5 ? 5 : Number(rating);
	const isReviewExists = await prisma.review.findFirst({
		where: {
			tenantId,
			propertyId,
		},
	});
	if (isReviewExists) {
		throw AppError.conflict("You already add review for this property.", "CONFLICT");
	}
	const response = await prisma.review.create({
		data: {
			tenantId,
			propertyId,
			comment,
			rating: calculateRating,
		},
		select: {
			rating: true,
			comment: true,
		},
	});
	if (!response) {
		throw AppError.internal("Failed to add review.");
	}
	return response;
};

const getPropertyReviews = async (propertyId: string) => {
	const response = await prisma.review.findMany({
		where: {
			propertyId,
		},
	});
	return response;
};

const deleteReview = async (reviewId: string) => {
	await prisma.review.delete({ where: { id: reviewId } });
};

const updateReview = async (payload: ReviewDto) => {
	const response = await prisma.review.update({
		where: { id: payload.reviewId },
		data: {
			comment: payload.comment,
		},
		omit: {
			createdAt: true,
			updatedAt: true,
		},
	});
	return response;
};

export const reviewServices = {
	addReview,
	getPropertyReviews,
	deleteReview,
	updateReview,
};
