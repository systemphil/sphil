import { Billing } from "features/billing/components/Billing";
import { auth } from "lib/auth/authConfig";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { dbGetUserPurchasedCourses } from "lib/database/dbFuncs";
import { redirect } from "next/navigation";

export const metadata = {};

export default async function BillingPage() {
    const session = await auth();

    if (!session) {
        redirect("/");
    }

    const purchasedCourses = await dbGetUserPurchasedCourses(session.user.id);

    return (
        <PageWrapper>
            <Billing purchasedCourses={purchasedCourses} />
        </PageWrapper>
    );
}
