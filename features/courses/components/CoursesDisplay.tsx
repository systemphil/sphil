import { dbGetAllPublishedCourses } from "lib/database/dbFuncs";
import { CourseCard } from "./CourseCard";
import { Heading } from "lib/components/ui/Heading";
import { cacheKeys } from "lib/config/cache";
import { cacheLife, cacheTag } from "next/cache";

export async function CoursesDisplay() {
    "use cache";
    cacheTag(cacheKeys.allPublicCourses);
    cacheLife("weeks");
    const courses = await dbGetAllPublishedCourses();

    if (courses.length === 0) {
        return (
            <Heading as="h6">
                No courses available. Please check in at a later time.
            </Heading>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:px-6 mb-12 md:mb-32">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}
