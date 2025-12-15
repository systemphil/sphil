import { dbGetUserProgress } from "lib/database/dbFuncs";
import { cacheLife, cacheTag } from "next/cache";
import { cacheKeys } from "lib/config/cacheKeys";
import { LessonCompletionButtonClient } from "./LessonCompleteButton.client";

export async function LessonCompletionButton({
    lessonId,
    courseId,
    courseSlug,
    userId,
}: {
    lessonId: string;
    courseId: string;
    courseSlug: string;
    userId: string;
}) {
    "use cache";
    cacheTag(
        ...cacheKeys.tagUserProgress({ userId, lessonId, courseId, courseSlug })
    );
    cacheLife("weeks");

    const userProgress = await dbGetUserProgress({
        lessonId,
        userId,
    });

    return (
        <LessonCompletionButtonClient
            isCompleted={!!userProgress}
            courseId={courseId}
            lessonId={lessonId}
        />
    );
}
