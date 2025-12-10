import { dbGetUserProgress } from "lib/database/dbFuncs";
import { cacheLife, cacheTag } from "next/cache";
import { cacheKeys } from "lib/config/cacheKeys";
import { LessonCompletionButtonClient } from "./LessonCompleteButton.client";

export async function LessonCompletionButton({
    lessonId,
    courseId,
    userId,
}: {
    lessonId: string;
    courseId: string;
    userId: string;
}) {
    "use cache";
    cacheTag(...cacheKeys.tagUserProgress({ userId, lessonId, courseId }));
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
