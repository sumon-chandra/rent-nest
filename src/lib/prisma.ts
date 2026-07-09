import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import envConfigs from "../configs/env-configs";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const globalForPrisma = globalThis as unknown as {
	prisma?: PrismaClient;
};
if (envConfigs.node_env !== "production") {
	globalForPrisma.prisma = prisma;
}

export { prisma };
