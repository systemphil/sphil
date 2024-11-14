import { CourseForm } from "features/courses/components/forms/CourseForm";
import { Heading } from "lib/components/ui/Heading";
import { PageWrapper } from "lib/components/ui/PageWrapper";

export const metadata = {};

export default async function NewCourse() {
    return (
        <PageWrapper>
            <Heading as="h1">New Course</Heading>
            <CourseForm />
        </PageWrapper>
    );
}
