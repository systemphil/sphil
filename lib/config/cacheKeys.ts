const EVERYTHING = "ALL_YOUR_CACHES_ARE_BELONG_TO_US";
const userProgress = "userProgress";

export const cacheKeys = {
    /**
     * Root keys for manual revalidation
     */
    keys: {
        EVERYTHING: () => EVERYTHING,

        userProgressUser: ({ userId }: { userId: string }) =>
            `${userProgress}:${userId}`,

        userProgressCourse: ({
            userId,
            courseId,
        }: {
            userId: string;
            courseId: string;
        }) => `${userProgress}:${userId}:course:${courseId}`,

        userProgressLesson: ({
            userId,
            lessonId,
        }: {
            userId: string;
            lessonId: string;
        }) => `${userProgress}:${userId}:lesson:${lessonId}`,
    },

    allPublicCourses: "allPublicCourses",
    allSeminars: "allSeminars",
    allUserProgress: "allUserProgress",

    tagUserProgress: ({
        userId,
        courseId,
        lessonId,
    }: {
        userId: string;
        courseId: string;
        lessonId: string;
    }) => [
        EVERYTHING,
        cacheKeys.keys.userProgressUser({ userId }),
        cacheKeys.keys.userProgressCourse({ userId, courseId }),
        cacheKeys.keys.userProgressLesson({ userId, lessonId }),
    ],

    maintenanceGlobal: "maintenanceGlobal",
    maintenanceUser: "maintenanceUser",
} as const;
