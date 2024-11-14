import { PrismaClient } from "@prisma/client";

import { env } from "process";

const LOG_ACTIVE = env.PRISMA_DEBUG === "true" ? true : false;

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            env.NODE_ENV === "development" && LOG_ACTIVE
                ? ["query", "error", "warn"]
                : ["error"],
    });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
