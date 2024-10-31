import type { Course } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Heading } from "lib/components/ui/Heading";
import { GlowBoundary } from "lib/components/animations/GlowBoundary";

type CourseCardProps = {
    course: Course;
};

export async function CourseCard({ course }: CourseCardProps) {
    const href = `/symposia/courses/${course.slug}`;

    return (
        <GlowBoundary>
            <div className="w-full rounded border bg-gradient-to-b from-neutral-50/90 to-neutral-100/90 transition duration-300 dark:from-neutral-950/90 dark:to-neutral-800/90 md:hover:border-transparent md:bg-gradient-to-bl">
                <Link href={href}>
                    {course.imageUrl && (
                        <Image
                            className="w-full rounded-t-lg"
                            src={course.imageUrl}
                            alt={`Video thumbnail preview for ${course.name}`}
                            width={340}
                            height={240}
                            priority
                        />
                    )}

                    <div className="p-8">
                        {!course.published && (
                            <span className="bg-slate-200 text-slate-700 rounded-full text-xs py-1 px-3 mb-2 inline-block">
                                Draft
                            </span>
                        )}
                        <Heading as="h3">{course.name}</Heading>
                        <p className="text-slate-700">{course.description}</p>
                    </div>
                </Link>
            </div>
        </GlowBoundary>
    );
}
