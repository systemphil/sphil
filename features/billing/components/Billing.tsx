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
                                        <CardShell className="p-4 hover:bg-slate-500">
                                            <div className="flex">
                                                {course.imageUrl && (
                                                    <Image
                                                        className="custom-mask custom-mask-parallelogram"
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
                                                    <div className="p-2 bg-purple-100 rounded-md">
                                                        <span>
                                                            Course last
                                                            updated:&nbsp;
                                                        </span>
                                                        {new Date(
                                                            course.updatedAt
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardShell>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-96 bg-slate-100 p-4 rounded-md text-stone-500">
                            If you wish to refund a course, please contact us at{" "}
                            <a
                                href="mailto:support@systemphil.com"
                                className="text-blue-400 underline hover:text-blue-700"
                            >
                                this email
                            </a>
                            .
                            <div className="text-stone-500 mt-1">
                                Please note that refunds are only available
                                within 7 days of purchase.
                            </div>
                        </div>
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
