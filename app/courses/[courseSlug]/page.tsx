import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { Loading } from "lib/components/animations/Loading";
import { CourseFrontPage } from "features/courses/components/CourseFrontPage";
import { errorMessages } from "lib/config/errorMessages";
import type { Metadata } from "next";
import { dbGetCourseDataCache } from "lib/database/dbFuncs";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ courseSlug: string }>;
}): Promise<Metadata> {
    const { courseSlug: slug } = await params;
    const course = await dbGetCourseDataCache(slug);

    if (!course) {
        return {
            title: "Course Not Found",
            description: "The requested course could not be found.",
        };
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sphil.zyx";
    const canonicalUrl = `${siteUrl}/courses/${slug}`;

    const imageUrl = course.imageUrl || null;

    return {
        title: course.name,
        description: course.description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: course.name,
            description: course.description,
            url: canonicalUrl,
            images: imageUrl
                ? [{ url: imageUrl, width: 800, height: 240 }]
                : [],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: course.name,
            description: course.description,
            images: imageUrl
                ? [{ url: imageUrl, width: 800, height: 240 }]
                : [],
        },
    };
}

// TODO consider static generate and add data-pagefind-body for search indexing

export default async function CourseFrontPageRoute({
    params,
}: {
    params: Promise<{ courseSlug: string }>;
}) {
    const { courseSlug: slug } = await params;

    if (!slug) {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    return (
        <PageWrapper>
            <Suspense fallback={<Loading.RingFullPage />}>
                <CourseFrontPage slug={slug} />
            </Suspense>
        </PageWrapper>
    );
}
