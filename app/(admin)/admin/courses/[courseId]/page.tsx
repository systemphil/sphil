import Link from "lib/components/navigation/ClientNextLink";
import { redirect } from "next/navigation";
import { Heading } from "lib/components/ui/Heading";
import { CourseForm } from "features/courses/components/forms/CourseForm";
import { dbGetCourseAndDetailsAndLessonsById } from "lib/database/dbFuncs";
import { CourseMaterialCard } from "features/courses/components/CourseMaterialCard";
import { errorMessages } from "lib/config/errorMessages";
import { CourseLessonsSortable } from "features/courses/components/CourseLessonsSortable";
import { Alert, Button } from "@mui/material";
import { auth } from "lib/auth/authConfig";
import { determineAdminCourseAccess } from "lib/auth/authFuncs";
import { CreateNewSeminarCohortBtn } from "features/courses/components/CreateNewSeminarCohortBtn";

export const metadata = {};

export default async function AdminCourseEdit({
    params,
}: {
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    if (typeof courseId !== "string") {
        redirect(`/?error=${errorMessages.missingParams}`);
    }

    const session = await auth();

    if (!session) {
        redirect(`/?error=${errorMessages.missingSession}`);
    }

    const course = await dbGetCourseAndDetailsAndLessonsById(courseId);

    if (!course) {
        redirect(`/?error=${errorMessages.courseNotFound}`);
    }

    const { courseAccess, seminarAccess } = determineAdminCourseAccess(
        session,
        course
    );

    const currentYear = new Date().getFullYear();

    return (
        <div className="my-4 min-h-screen container">
            <Heading as="h2">{course.name}</Heading>
            <div className="grid md:grid-cols-2">
                <div>{courseAccess && <CourseForm course={course} />}</div>

                <div className="flex flex-col gap-6">
                    {courseAccess && (
                        <>
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
                                    <div className="flex items-center flex-col justify-center">
                                        <p className="text-center">None yet.</p>
                                        <Button
                                            variant="contained"
                                            LinkComponent={Link}
                                            href={`/admin/courses/${courseId}/course-details/new`}
                                        >
                                            Add details
                                        </Button>
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
                                        <p className="text-center">None yet.</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    variant="contained"
                                    LinkComponent={Link}
                                    href={`/admin/courses/${course.id}/lessons/new`}
                                >
                                    Add a lesson
                                </Button>
                            </div>
                        </>
                    )}
                    {seminarAccess && (
                        <div>
                            <Heading as="h4">Seminar Cohorts</Heading>
                            {course.seminarCohorts.length > 0 ? (
                                course.seminarCohorts.map((cohort) => (
                                    <CourseMaterialCard
                                        key={`${courseId}-seminarCohort`}
                                        href={`/admin/courses/${courseId}/seminar-cohort/${cohort.id}`}
                                        heading={`${cohort.year} Cohort`}
                                        id={cohort.id}
                                        modelName="UNSUPPORTED"
                                    />
                                ))
                            ) : (
                                <div>
                                    <p className="text-center">
                                        No cohorts at this time
                                    </p>
                                </div>
                            )}
                            {(course.seminarCohorts.length === 0 ||
                                !course.seminarCohorts.some(
                                    (c) => c.year === currentYear
                                )) && (
                                <CreateNewSeminarCohortBtn
                                    currentYear={currentYear}
                                    courseId={course.id}
                                />
                            )}

                            <Alert color="info" sx={{ mt: 2 }}>
                                Seminar cohorts are automatically generated when
                                a user signs up for seminars for the current
                                year
                            </Alert>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
