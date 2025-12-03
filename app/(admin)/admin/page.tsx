import { CoursesDisplayAdmin } from "features/courses/components/CoursesDisplayAdmin";
import { CreateCourseBtn } from "features/courses/components/CreateCourseBtn";
import { Heading } from "lib/components/ui/Heading";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { Suspense } from "react";

export const metadata = {};

export default async function AdminPage() {
    return (
        <PageWrapper>
            <Heading as="h2">Courses</Heading>
            <Suspense>
                <CoursesDisplayAdmin />
            </Suspense>
            <CreateCourseBtn />
        </PageWrapper>
    );
}
