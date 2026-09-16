import { Heading } from "lib/components/ui/Heading";
import { dbGetPlanningAssignees, dbGetPlanningItems } from "lib/database/dbFuncs";
import { PlanningTimeline } from "features/planning/components/PlanningTimeline";

export const metadata = {};

/**
 * Reads admin-gated data on every request, so there is no static shell to
 * validate. `instant = false` on the parent layout does not cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

/**
 * Planning timeline for courses and teaching work. Access is enforced by the
 * admin layout and again by the db functions.
 */
export default async function AdminPlanningPage() {
    const [items, assignees] = await Promise.all([
        dbGetPlanningItems(),
        dbGetPlanningAssignees(),
    ]);

    return (
        <main className="min-h-screen w-full flex flex-col gap-4 px-4 py-6">
            <Heading as="h2">Planning</Heading>
            <PlanningTimeline items={items} assignees={assignees} />
        </main>
    );
}
