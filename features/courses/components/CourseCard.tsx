import type { Course } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Heading } from "lib/components/ui/Heading";
import { GlowBoundary } from "lib/components/animations/GlowBoundary";
import { CourseCardDeleteButton } from "./CourseCardDeleteButton";

type CourseCardProps = {
    course: Course;
    isAdmin?: boolean;
    isSudo?: boolean;
};

export async function CourseCard({
    course,
    isAdmin = false,
    isSudo = false,
}: CourseCardProps) {
    const href = isAdmin
        ? `/admin/courses/${course.id}`
        : `/courses/${course.slug}`;

    return (
        <GlowBoundary>
            <div className="w-full h-full rounded-lg border bg-linear-to-b from-neutral-50/90 to-neutral-100/90 transition duration-300 dark:from-neutral-950/90 dark:to-neutral-800/90 md:hover:border-transparent md:bg-linear-to-bl">
                <Link href={href}>
                    {course.imageUrl && (
                        <div className="aspect-video relative">
                            <Image
                                className="object-cover w-full rounded-t-md"
                                src={course.imageUrl}
                                alt={`Video thumbnail preview for ${course.name}`}
                                fill
                                priority
                            />
                        </div>
                    )}

                    <div className="p-6 flex flex-col grow">
                        {!course.published && (
                            <div className="absolute">
                                <span className="bg-slate-200 text-slate-700 rounded-full text-xs py-1 px-3 mb-2 inline-block">
                                    Draft
                                </span>
                            </div>
                        )}
                        <Heading as="h5">{course.name}</Heading>
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
