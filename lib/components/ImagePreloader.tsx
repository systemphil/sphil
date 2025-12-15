import { dbGetAllPublishedCoursesDataCache } from "lib/database/dbFuncs";
import Image from "next/image";

/**
 * Wrap it in `<Suspense>` to make it non-blocking.
 *
 * Because Next does additional image optimizations, it takes
 * a hot second for the images to load on a fresh instance.
 * So we preload them to speed things up.
 */
export async function ImagePreloader() {
    const courses = await dbGetAllPublishedCoursesDataCache();

    if (courses.length === 0) {
        return null;
    }

    return (
        <div className="absolute -left-[9999px] -top-[9999px] w-px h-px overflow-hidden">
            {courses.map((course) => {
                if (course.imageUrl) {
                    return (
                        <Image
                            key={`key-img-${course.slug}`}
                            className="object-cover w-full rounded-t-md"
                            src={course.imageUrl}
                            alt={`Video thumbnail preview for ${course.name}`}
                            fill
                            priority
                        />
                    );
                }
                return null;
            })}
        </div>
    );
}
