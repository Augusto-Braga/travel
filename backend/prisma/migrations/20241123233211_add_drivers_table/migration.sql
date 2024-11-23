-- CreateTable
CREATE TABLE "drivers" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "review" JSONB NOT NULL,
    "price_per_km" DOUBLE PRECISION NOT NULL,
    "min_km" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "drivers_pkey" PRIMARY KEY ("id")
);
