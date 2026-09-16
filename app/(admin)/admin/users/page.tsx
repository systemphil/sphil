import { Box } from "@mui/material";
import { notFound } from "next/navigation";
import { auth } from "lib/auth/authConfig";
import { Heading } from "lib/components/ui/Heading";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import {
    dbGetUsersPaginated,
    USERS_SORTABLE_FIELDS,
    type UsersSortField,
} from "lib/database/dbFuncs";
import { UsersTable } from "features/users/components/UsersTable";

export const metadata = {};

/**
 * The SUPERADMIN gate and the searchParams-driven query both decide what (and
 * whether) to render, so this segment has no static shell of its own either.
 * `instant = false` on the parent layout does not cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

function parsePositiveInt(value: string | undefined, fallback: number) {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isNaN(parsed) || parsed < 1 ? fallback : Math.trunc(parsed);
}

function isSortField(value: string | undefined): value is UsersSortField {
    return USERS_SORTABLE_FIELDS.includes(value as UsersSortField);
}

/**
 * User management. Restricted to SUPERADMIN — a regular ADMIN gets a 404, the
 * same as any non-admin, so the route's existence isn't advertised.
 */
export default async function AdminUsersPage({
    searchParams,
}: {
    searchParams: Promise<{
        q?: string;
        page?: string;
        pageSize?: string;
        sort?: string;
        dir?: string;
    }>;
}) {
    const session = await auth();

    if (!session || session.user.role !== "SUPERADMIN") {
        return notFound();
    }

    const params = await searchParams;

    const search = params.q?.trim() ?? "";
    const page = parsePositiveInt(params.page, 1);
    const pageSize = parsePositiveInt(params.pageSize, 25);
    const sortField = isSortField(params.sort) ? params.sort : "createdAt";
    const sortDirection = params.dir === "asc" ? "asc" : "desc";

    const {
        users,
        total,
        page: currentPage,
        pageSize: currentPageSize,
    } = await dbGetUsersPaginated({
        search: search || undefined,
        page,
        pageSize,
        sortField,
        sortDirection,
    });

    return (
        <PageWrapper className="py-6 gap-6">
            <Heading as="h2">Users</Heading>
            <Box sx={{ width: "100%", maxWidth: 1100 }}>
                <UsersTable
                    users={users}
                    total={total}
                    page={currentPage}
                    pageSize={currentPageSize}
                    sortField={sortField}
                    sortDirection={sortDirection}
                    search={search}
                    currentUserId={session.user.id}
                />
            </Box>
        </PageWrapper>
    );
}
