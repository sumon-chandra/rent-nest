-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "amenities" TEXT[],
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "isFeatured" BOOLEAN DEFAULT false,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "thumbnail" TEXT;
