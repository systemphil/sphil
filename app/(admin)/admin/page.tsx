import { Button } from "@mui/material";
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
            <Button
                variant="contained"
                LinkComponent={Link}
                href="/admin/courses/new"
            >
                Create a course
            </Button>
        </PageWrapper>
    );
}
