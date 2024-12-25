import { Heading } from "lib/components/ui/Heading";
import { CourseEnroll } from "./CourseEnroll";

export function CourseEnrollNowPage({ slug }: { slug: string }) {
    return (
        <div className="min-h-screen flex flex-col items-center py-6 gap-4">
            <Heading as="h2">Enroll in this course today!</Heading>
            <CourseEnroll slug={slug} />
        </div>
    );
}
