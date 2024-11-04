import {
    dbGetAllCourses,
    dbGetAllPublishedCourses,
} from "lib/database/dbFuncs";
import { CourseCard } from "./CourseCard";
import { Heading } from "lib/components/ui/Heading";
import { Course } from "@prisma/client";
import { auth } from "lib/auth/authConfig";

export async function CoursesDisplay({
    isAdmin = false,
}: {
    isAdmin?: boolean;
}) {
    let courses: Course[] = [];

    if (isAdmin) {
        const session = await auth();
        if (
            !session ||
            (session.user.role !== "ADMIN" &&
                session.user.role !== "SUPERADMIN")
        ) {
            return <Heading as="h6">Authentication error.</Heading>;
        }
        courses = await dbGetAllCourses();
    } else {
        courses = await dbGetAllPublishedCourses();
    }

    if (courses.length === 0) {
        return (
            <Heading as="h6">
                No courses available. Please check in at a later time.
            </Heading>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} isAdmin />
            ))}
        </div>
    );
}
