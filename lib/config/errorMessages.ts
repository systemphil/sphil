export const errorMessages = {
    courseNotPurchased: "course-not-purchased",
    courseNotFound: "course-not-found",
    lessonNotFound: "lesson-not-found",
    missingSearchParams: "missing-search-params",
    missingParams: "missing-params",
    mustBeLoggedIn: "must-be-logged-in",
    unauthorized: "unauthorized",
} as const;

export type ErrorMessages = (typeof errorMessages)[keyof typeof errorMessages];
