import { VerifyPurchase } from "features/billing/components/VerifyPurchase";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {};

export default async function PublishedCourses({
    searchParams,
}: {
    searchParams: { p: string; s: string };
}) {
    const { p: purchasePriceId, s: slug } = searchParams;
    if (!purchasePriceId || !slug) {
        return redirect("/?error=missing-params");
    }

    return (
        <PageWrapper>
            <Suspense>
                <VerifyPurchase purchasePriceId={purchasePriceId} slug={slug} />
            </Suspense>
        </PageWrapper>
    );
}
