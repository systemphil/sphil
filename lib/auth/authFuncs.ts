import type { Session } from "next-auth";
import { auth } from "./authConfig";
import type { dbGetCourseAndDetailsAndLessonsById } from "lib/database/dbFuncs";

/**
 * Checks the user's authentication session for admin access.
 *
 * This function verifies whether the user's authentication session is valid and
 * has the role of "ADMIN". If the user is not authenticated or doesn't have the
 * required role, an AuthenticationError is thrown.
 *
 * @throws {UnauthorizedError} If the user is not authenticated or lacks admin access.
 * @returns {Promise<void>} A Promise that resolves if the user has admin access.
 * @async
 */
export const validateAdminOrThrow = async (): Promise<void> => {
    const session = await auth();

    if (
        !session ||
        (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
        throw new UnauthorizedError();
    }
};

export const validateAdminAccess = async (): Promise<boolean> => {
    const session = await auth();

    if (
        session &&
        (session.user.role === "ADMIN" || session.user.role === "SUPERADMIN")
    ) {
        return true;
    }
    return false;
};

export const requireUserAuthOrThrow = async (): Promise<void> => {
    const session = await auth();

    if (!session?.user) {
        throw new UnauthorizedError();
    }
};
export class UnauthorizedError extends Error {
    constructor() {
        super("Access denied. Insufficient Authorization.");
        this.name = "AuthenticationError";
    }
}

/**
 * Admin check wrapper with exception handling. Use by inputting the intended function as an argument to this one.
 * @param retrieveFunc
 * @returns void if successful, throws error if not
 */
export const withAdmin = async <T>(
    retrieveFunc: () => Promise<T>
): Promise<T> => {
    await validateAdminOrThrow();
    return await retrieveFunc();
};

/**
 * User check wrapper with exception handling. Use by inputting the intended function as an argument to this one.
 * @param retrieveFunc
 * @returns void if successful, throws error if not
 */
export const withUser = async <T>(
    retrieveFunc: () => Promise<T>
): Promise<T> => {
    await requireUserAuthOrThrow();
    return await retrieveFunc();
};

export function determineCourseAccess(
    session: Session,
    course: NonNullable<
        Awaited<ReturnType<typeof dbGetCourseAndDetailsAndLessonsById>>
    >
) {
    const fullAccess = {
        courseAccess: true,
        seminarAccess: true,
    };

    const limitedAccess = {
        courseAccess: false,
        seminarAccess: true,
    };

    if (session.user.role === "SUPERADMIN") {
        return fullAccess;
    }

    if (course.creators.some((c: { id: string }) => c.id === session.user.id)) {
        return fullAccess;
    }

    if (
        course.assistants.some((c: { id: string }) => c.id === session.user.id)
    ) {
        return limitedAccess;
    }

    throw new Error(
        "Expected either superadmin, a course creator or assistant"
    );
}
