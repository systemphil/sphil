import { Seminar } from "@prisma/client";
import { auth } from "lib/auth/authConfig";
import { Heading } from "lib/components/ui/Heading";
import {
    dbGetCourseBySlug,
    dbGetSeminarCohortByCourseAndUser,
} from "lib/database/dbFuncs";
import { romanize } from "lib/utils";
import Link from "next/link";

type CourseLessonContentsProps = {
    courseSlug: string;
};

const links = {
    courses: "/symposia/courses",
};

export async function TableOfSeminarCohorts({
    courseSlug,
}: CourseLessonContentsProps) {
    const session = await auth();

    if (!session) {
        return null;
    }

    const course = await dbGetCourseBySlug(courseSlug);

    if (!course) {
        console.error("SeminarCohort table expected course data");
        return null;
    }

    const seminarCohorts = await dbGetSeminarCohortByCourseAndUser({
        courseId: course.id,
        userId: session.user.id,
    });

    if (seminarCohorts.length > 0) {
        return (
            <div className="mt-4 md:py-8 max-w-[320px]">
                <div>
                    <Heading as="h3">Seminars</Heading>
                    {seminarCohorts.map((seminarCohort, index) => {
                        return (
                            <div key={`${seminarCohort.year}-${index}`}>
                                <Heading as="h6">
                                    Cohort {seminarCohort.year}
                                </Heading>
                                <SeminarsMap
                                    seminars={seminarCohort.seminars}
                                    courseSlug={courseSlug}
                                    seminarCohortYear={seminarCohort.year}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // TODO add potential seminar enrollment here!
    return null;
}

function SeminarsMap({
    seminars,
    courseSlug,
    seminarCohortYear,
}: {
    seminars: Seminar[];
    courseSlug: string;
    seminarCohortYear: number;
}) {
    return (
        <ul className="max-w-xs">
            {seminars.map((seminar: Seminar) => {
                return (
                    <li key={seminar.order}>
                        <Link
                            className="dark:hover:bg-dark-green-hsl hover:bg-slate-200/90 transition-all duration-300 flex p-1 rounded-md"
                            href={`${links.courses}/${courseSlug}/seminar/${seminarCohortYear}/${seminar.order}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                            </svg>
                            <span className="ml-1">
                                {`Seminar ${romanize(seminar.order)}`}
                            </span>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
