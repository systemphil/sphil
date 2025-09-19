import {
    dbGetAllCourses,
    dbGetAllCoursesByCreatorsOrTutors,
    dbGetAllPublishedCourses,
} from "lib/database/dbFuncs";
import { CourseCard } from "./CourseCard";
import { Heading } from "lib/components/ui/Heading";
import type { Course } from "@prisma/client";
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
        if (session.user.role === "SUPERADMIN") {
            courses = await dbGetAllCourses();
        } else {
            courses = await dbGetAllCoursesByCreatorsOrTutors(session.user.id);
        }
    } else {
        courses = await dbGetAllPublishedCourses();
    }

    if (courses.length === 0) {
        if (isAdmin) {
            return (
                <Heading as="h6">
                    No courses. Click below to create one!
                </Heading>
            );
        }
        return (
            <Heading as="h6">
                No courses available. Please check in at a later time.
            </Heading>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:px-6 mb-12 md:mb-32">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} isAdmin={isAdmin} />
            ))}
        </div>
    );
}
