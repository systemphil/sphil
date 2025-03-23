import { CoursesDisplay } from "features/courses/components/CoursesDisplay";
import { Heading } from "lib/components/ui/Heading";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import Link from "next/link";

export const metadata = {};

export default async function AdminPage() {
    return (
        <PageWrapper>
            <Heading as="h2">Courses</Heading>
            <CoursesDisplay isAdmin />
            <Link href="/admin/courses/new">
                <button type="button" className="d-btn d-btn-primary">
                    Create a course
                </button>
            </Link>
        </PageWrapper>
    );
}
