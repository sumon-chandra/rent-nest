-- CreateTable
CREATE TABLE "favorite_property" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,

    CONSTRAINT "favorite_property_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorite_property_tenantId_idx" ON "favorite_property"("tenantId");

-- CreateIndex
CREATE INDEX "favorite_property_propertyId_idx" ON "favorite_property"("propertyId");

-- AddForeignKey
ALTER TABLE "favorite_property" ADD CONSTRAINT "favorite_property_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_property" ADD CONSTRAINT "favorite_property_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
