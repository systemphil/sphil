import { AdminCourseBreadcrumbs } from "features/courses/components/AdminCourseBreadcrumbs";

/**
 * Admin-gated and reads per-request data, so there is no static shell to
 * validate. `instant = false` on the admin layout does not cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

/** Catch-all slot page: receives every path segment below /admin/courses. */
export default async function AdminCoursesBreadcrumbsSlot({
    params,
}: {
    params: Promise<{ segments: string[] }>;
}) {
    const { segments } = await params;
    return <AdminCourseBreadcrumbs segments={segments} />;
}
