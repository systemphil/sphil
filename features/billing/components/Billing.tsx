import { Alert, Button, Typography } from "@mui/material";
import { TableOfLessons } from "features/courses/components/TableOfLessons";
import { TableOfSeminarCohorts } from "features/courses/components/TableOfSeminarCohorts";
import { Loading } from "lib/components/animations/Loading";
import { Maintenance } from "lib/components/Maintenance";
import { CardShell } from "lib/components/ui/CardShell";
import type { dbGetUserPurchasedCourses } from "lib/database/dbFuncs";
import Image from "next/image";
import { Suspense } from "react";

export function Billing({
    purchasedCourses,
}: {
    purchasedCourses: Awaited<ReturnType<typeof dbGetUserPurchasedCourses>>;
}) {
    return (
        <>
            <Suspense>
                <Maintenance area="user" />
            </Suspense>
            <div className="py-10">
                <h1 className="text-xl font-bold py-6 text-center">
                    My Courses
                </h1>
                {purchasedCourses && purchasedCourses.length > 0 ? (
                    <>
                        <p className="text-lg py-2 text-center">
                            Here are your purchased courses
                        </p>
                        <ul className="flex flex-start flex-wrap gap-4 py-4">
                            {purchasedCourses.map((course) => (
                                <li key={course.id}>
                                    <CardShell className="flex md:max-w-[550px] p-6 justify-center transition-all duration-200 hover:bg-pink-500/10 dark:hover:bg-acid-green/10">
                                        <div className="flex flex-wrap gap-6">
                                            <div className="flex flex-col justify-center w-full sm:w-[225px]">
                                                {course.imageUrl && (
                                                    <div className="relative overflow-hidden rounded-md shadow-sm">
                                                        <Image
                                                            className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                            src={
                                                                course.imageUrl
                                                            }
                                                            height={200}
                                                            width={200}
                                                            alt={course.name}
                                                        />
                                                    </div>
                                                )}
                                                <Button
                                                    href={`/courses/${course.slug}`}
                                                    variant="contained"
                                                    className="w-full justify-center mt-4"
                                                >
                                                    Course Page
                                                </Button>
                                                <div className="rounded-lg">
                                                    <TableOfLessons
                                                        lessons={course.lessons}
                                                        courseSlug={course.slug}
                                                    />
                                                </div>
                                                <div>
                                                    <Suspense
                                                        fallback={
                                                            <div className="w-full h-24 flex justify-center">
                                                                <Loading.RingLg />
                                                            </div>
                                                        }
                                                    >
                                                        <TableOfSeminarCohorts
                                                            courseSlug={
                                                                course.slug
                                                            }
                                                            isCentered={false}
                                                            isDropdown
                                                        />
                                                    </Suspense>
                                                </div>
                                            </div>

                                            <div className="w-full sm:w-[200px]">
                                                <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100">
                                                    {course.name}
                                                </h3>
                                                <div className="prose-sm dark:prose-invert text-gray-600 dark:text-gray-400 mt-2">
                                                    {course.description}
                                                </div>
                                            </div>
                                        </div>
                                    </CardShell>
                                </li>
                            ))}
                        </ul>
                        <Alert className="mt-96 rounded-lg" severity="info">
                            <Typography>
                                If you wish to refund a course, please contact
                                us at{" "}
                                <a
                                    href="mailto:support@systemphil.com"
                                    className="text-blue-400 underline hover:text-blue-700"
                                >
                                    this email
                                </a>
                                .
                                <br />
                                Please note that refunds are only available
                                within 7 days of purchase.
                            </Typography>
                        </Alert>
                    </>
                ) : (
                    <div>
                        <p className="text-lg text-stone-500 py-6">
                            No purchased courses
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
