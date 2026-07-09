import { Review } from "../../../generated/prisma/client";

export type ReviewDto = Pick<Review, "comment"> & { reviewId: string };
