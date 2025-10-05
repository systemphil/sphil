import { Alert, Typography } from "@mui/material";
import { Course } from "@prisma/client";
import { Maintenance } from "lib/components/Maintenance";
import { CardShell } from "lib/components/ui/CardShell";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export function Billing({
    purchasedCourses,
}: {
    purchasedCourses: Course[] | null;
}) {
    return (
        <>
            <Suspense>
                <Maintenance area="user" />
            </Suspense>
            <div className="py-10">
                <h1 className="text-xl font-bold py-6 text-center">Billing</h1>
                {purchasedCourses && purchasedCourses.length > 0 ? (
                    <>
                        <p className="text-lg py-2 text-center">
                            Here are your purchased courses
                        </p>
                        <ul className="py-4">
                            {purchasedCourses.map((course) => (
                                <li key={course.id}>
                                    <Link
                                        href={`/symposia/courses/${course.slug}`}
                                    >
                                        <CardShell className="p-4 hover:!bg-pink-500 dark:hover:!bg-acid-green !transition-colors !duration-150">
                                            <div className="flex">
                                                {course.imageUrl && (
                                                    <Image
                                                        className="rounded-md"
                                                        src={course.imageUrl}
                                                        height={200}
                                                        width={200}
                                                        alt="course image"
                                                    ></Image>
                                                )}
                                                <div className="ml-10 flex flex-col justify-between">
                                                    <div>
                                                        <div className="text-lg font-bold">
                                                            {course.name}
                                                        </div>
                                                        <div>
                                                            {course.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardShell>
                                    </Link>
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
