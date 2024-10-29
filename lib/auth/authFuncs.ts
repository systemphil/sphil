import { auth } from "./authConfig";

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
export const requireAdminAuth = async (): Promise<void> => {
    const session = await auth();

    if (
        !session ||
        (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
        throw new UnauthorizedError();
    }
};

export const requireUserAuth = async (): Promise<void> => {
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
    await requireAdminAuth();
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
    await requireUserAuth();
    return await retrieveFunc();
};
