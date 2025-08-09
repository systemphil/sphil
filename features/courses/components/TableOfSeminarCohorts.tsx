import { Seminar } from "@prisma/client";
import { auth } from "lib/auth/authConfig";
import { Heading } from "lib/components/ui/Heading";
import {
    dbGetCourseBySlug,
    dbGetSeminarCohortByCourseAndUser,
} from "lib/database/dbFuncs";
import { romanize } from "lib/utils";
import Link from "next/link";

const links = {
    courses: "/symposia/courses",
};

export async function TableOfSeminarCohorts({
    courseSlug,
    isCentered = false,
    isDropdown = false,
}: {
    courseSlug: string;
    isCentered?: boolean;
    isDropdown?: boolean;
}) {
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
                    <Heading as="h4">Seminars</Heading>
                    <div
                        className={isDropdown ? "flex justify-center gap2" : ""}
                    >
                        {seminarCohorts.map((seminarCohort, index) => {
                            return (
                                <div
                                    key={`${seminarCohort.year}-${index}`}
                                    className={
                                        isDropdown
                                            ? "d-dropdown d-dropdown-top d-dropdown-end"
                                            : ""
                                    }
                                >
                                    {isDropdown ? (
                                        <div
                                            tabIndex={index}
                                            role="button"
                                            className="d-btn d-btn-primary m-1"
                                        >
                                            <Heading
                                                as="h6"
                                                replacementClasses="!text-stone-200"
                                            >
                                                Cohort {seminarCohort.year}
                                            </Heading>
                                        </div>
                                    ) : (
                                        <Heading as="h6">
                                            Cohort {seminarCohort.year}
                                        </Heading>
                                    )}

                                    <SeminarsMap
                                        isCentered={isCentered}
                                        seminars={seminarCohort.seminars}
                                        courseSlug={courseSlug}
                                        seminarCohortYear={seminarCohort.year}
                                        isDropdown={isDropdown}
                                        tabIndex={index}
                                    />
                                </div>
                            );
                        })}
                    </div>
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
    isCentered = false,
    isDropdown = false,
    tabIndex = 0,
}: {
    seminars: Seminar[];
    courseSlug: string;
    seminarCohortYear: number;
    isCentered?: boolean;
    isDropdown?: boolean;
    tabIndex?: number;
}) {
    const isCenteredClasses = isCentered
        ? "justify-center w-full"
        : "flex-start";

    return (
        <ul
            className={
                isDropdown
                    ? "d-dropdown-content d-menu bg-base-100 dark:bg-stone-900 rounded-box z-1 w-52 p-2 shadow-sm"
                    : "max-w-xs"
            }
            tabIndex={tabIndex}
        >
            {seminars.map((seminar: Seminar) => {
                return (
                    <li key={seminar.order}>
                        <Link
                            className={
                                isDropdown
                                    ? "dark:hover:bg-dark-green-hsl"
                                    : "dark:hover:bg-dark-green-hsl hover:bg-slate-200/90 transition-all duration-300 flex p-1 rounded-md"
                            }
                            href={`${links.courses}/${courseSlug}/seminars/${seminarCohortYear}/${seminar.order}`}
                        >
                            <div className={`flex ${isCenteredClasses} pl-0.5`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className="w-5 h-5"
                                >
                                    <path d="M3.5 8a5.5 5.5 0 1 1 8.596 4.547 9.005 9.005 0 0 1 5.9 8.18.751.751 0 0 1-1.5.045 7.5 7.5 0 0 0-14.993 0 .75.75 0 0 1-1.499-.044 9.005 9.005 0 0 1 5.9-8.181A5.496 5.496 0 0 1 3.5 8ZM9 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm8.29 4c-.148 0-.292.01-.434.03a.75.75 0 1 1-.212-1.484 4.53 4.53 0 0 1 3.38 8.097 6.69 6.69 0 0 1 3.956 6.107.75.75 0 0 1-1.5 0 5.193 5.193 0 0 0-3.696-4.972l-.534-.16v-1.676l.41-.209A3.03 3.03 0 0 0 17.29 8Z" />
                                </svg>
                                <span className="ml-1">
                                    {`Seminar ${romanize(seminar.order)}`}
                                </span>
                            </div>
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
}
