const EVERYTHING = "ALL_YOUR_CACHES_ARE_BELONG_TO_US";
const userProgress = "userProgress";

export const cacheKeys = {
    /**
     * Root keys for manual revalidation
     */
    keys: {
        EVERYTHING,

        publicCourses: "publicCourses",

        course: ({ courseSlug }: { courseSlug: string }) =>
            `course:${courseSlug}`,

        courseForLessons: ({ courseSlug }: { courseSlug: string }) =>
            `courseForLesson:${courseSlug}`,

        lesson: ({
            courseSlug,
            lessonSlug,
        }: {
            courseSlug: string;
            lessonSlug: string;
        }) => `lesson:${courseSlug}:${lessonSlug}`,

        seminarCohortsByCourseSlug: ({ courseSlug }: { courseSlug: string }) =>
            `seminarCohorts:${courseSlug}`,

        seminarsAll: "seminarsAll",

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

    tagPublicCourses: () => [EVERYTHING, cacheKeys.keys.publicCourses],

    tagCourse: ({ courseSlug }: { courseSlug: string }) => [
        EVERYTHING,
        cacheKeys.keys.publicCourses,
        cacheKeys.keys.course({ courseSlug }),
    ],

    tagLesson: ({
        lessonSlug,
        courseSlug,
    }: {
        lessonSlug: string;
        courseSlug: string;
    }) => [
        EVERYTHING,
        cacheKeys.keys.courseForLessons({ courseSlug }),
        cacheKeys.keys.lesson({ courseSlug, lessonSlug }),
    ],

    tagSeminarCohortsByCourseSlug: ({ courseSlug }: { courseSlug: string }) => [
        EVERYTHING,
        cacheKeys.keys.seminarsAll,
        cacheKeys.keys.seminarCohortsByCourseSlug({ courseSlug }),
    ],

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
