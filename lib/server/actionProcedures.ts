import { getUserSession } from "lib/auth/authFuncs";
import { buildAction } from "./ActionBuilder";

export const publicProcedure = buildAction();

export const protectedProcedure = publicProcedure.use(async () => {
    const session = await getUserSession();

    if (!session || !session.user) {
        throw new Error("Unauthenticated");
    }

    return { session, user: session.user };
});

export const adminProcedure = protectedProcedure.use(async ({ user }) => {
    if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
        return {};
    }

    throw new Error("Forbidden");
});
