import { CoursesDisplay } from "features/courses/components/CoursesDisplay";
import { CreateCourseBtn } from "features/courses/components/CreateCourseBtn";
import { Heading } from "lib/components/ui/Heading";
import { PageWrapper } from "lib/components/ui/PageWrapper";

export const metadata = {};

export default async function AdminPage() {
    return (
        <PageWrapper>
            <Heading as="h2">Courses</Heading>
            <CoursesDisplay isAdmin />
            <CreateCourseBtn />
        </PageWrapper>
    );
}
