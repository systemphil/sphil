import Link from "next/link";
import { redirect } from "next/navigation";
import { Heading } from "lib/components/ui/Heading";
import { CourseForm } from "features/courses/components/forms/CourseForm";
import { dbGetCourseAndDetailsAndLessonsById } from "lib/database/dbFuncs";
import { CourseMaterialCard } from "features/courses/components/CourseMaterialCard";
import { errorMessages } from "lib/config/errorMessages";
import { CourseLessonsSortable } from "features/courses/components/CourseLessonsSortable";

export const metadata = {};

export default async function AdminCourseEdit({
    params,
}: {
    params: { courseId: string };
}) {
    const { courseId } = await params;
    if (typeof courseId !== "string") {
        redirect(`/?error=${errorMessages.missingParams}`);
    }

    const course = await dbGetCourseAndDetailsAndLessonsById(courseId);

    if (!course) {
        redirect(`/?error=${errorMessages.courseNotFound}`);
    }

    return (
        <div className="my-4 min-h-screen container">
            <Heading as="h2">{course.name}</Heading>
            <div className="grid md:grid-cols-2">
                <div>
                    <CourseForm course={course} />
                </div>

                <div className="flex flex-col gap-6">
                    <div>
                        <Heading as="h4">Course Details</Heading>
                        {course.details ? (
                            <CourseMaterialCard
                                href={`/admin/courses/${courseId}/course-details/${course.details.id}`}
                                heading="General details of the course"
                                id={course.details.id}
                                modelName="CourseDetails"
                            />
                        ) : (
                            <div>
                                <p>None yet.</p>
                                <Link
                                    href={`/admin/courses/${courseId}/course-details/new`}
                                >
                                    <button className="d-btn d-btn-primary">
                                        Add details
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    <div>
                        <Heading as="h4">Lessons</Heading>
                        {course.lessons.length > 0 ? (
                            <CourseLessonsSortable
                                courseId={course.id}
                                lessons={course.lessons}
                            />
                        ) : (
                            <div>
                                <p>None yet.</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <Link href={`/admin/courses/${course.id}/lessons/new`}>
                            <button className="d-btn d-btn-primary">
                                Add a lesson
                            </button>
                        </Link>
                    </div>

                    <div>
                        <Heading as="h4">Seminar Cohorts</Heading>
                        {course.seminarCohorts.length > 0 ? (
                            course.seminarCohorts.map((cohort, index) => (
                                <CourseMaterialCard
                                    key={`${courseId}-seminarCohort-${index}`}
                                    href={`/admin/courses/${courseId}/seminar-cohort/${cohort.id}`}
                                    heading={`${cohort.year} Cohort`}
                                    id={cohort.id}
                                    modelName="UNSUPPORTED"
                                />
                            ))
                        ) : (
                            <div>
                                <p>
                                    Seminar cohorts are automatically generated
                                    when a user signs up for seminars
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
