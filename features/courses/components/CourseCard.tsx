import type { Course } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Heading } from "lib/components/ui/Heading";
import { GlowBoundary } from "lib/components/animations/GlowBoundary";
import { auth } from "lib/auth/authConfig";
import { CourseCardDeleteButton } from "./CourseCardDeleteButton";

type CourseCardProps = {
    course: Course;
    isAdmin?: boolean;
};

export async function CourseCard({ course, isAdmin = false }: CourseCardProps) {
    const href = isAdmin
        ? `/admin/courses/${course.id}`
        : `/symposia/courses/${course.slug}`;

    const session = await auth();

    const isSudo = session?.user.role === "SUPERADMIN";

    return (
        <GlowBoundary>
            <div className="w-full rounded-lg border bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 transition duration-300 dark:from-neutral-950/90 dark:to-neutral-800/90 md:hover:border-transparent md:bg-gradient-to-bl">
                <Link href={href}>
                    {course.imageUrl && (
                        <Image
                            className="max-h-[300px] w-full rounded-t-md"
                            src={course.imageUrl}
                            alt={`Video thumbnail preview for ${course.name}`}
                            width={340}
                            height={240}
                            layout="responsive"
                            priority
                        />
                    )}

                    <div className="p-8 flex flex-col grow">
                        {!course.published && (
                            <div>
                                <span className="bg-slate-200 text-slate-700 rounded-full text-xs py-1 px-3 mb-2 inline-block">
                                    Draft
                                </span>
                            </div>
                        )}
                        <Heading as="h3">{course.name}</Heading>
                        <p className="text-slate-700 dark:text-gray-300/90 text-center">
                            {course.description}
                        </p>
                    </div>
                </Link>
                {isAdmin && isSudo && (
                    <div className="flex justify-center py-1">
                        <CourseCardDeleteButton
                            id={course.id}
                            modelName="Course"
                        />
                    </div>
                )}
            </div>
        </GlowBoundary>
    );
}
