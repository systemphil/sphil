import { BreadcrumbTrail, type Crumb } from "lib/components/ui/BreadcrumbTrail";
import { dbGetAdminCourseBreadcrumbNames } from "lib/database/dbFuncs";

type ParsedRoute = {
    courseId?: string;
    lessonId?: string;
    seminarCohortId?: string;
    seminarId?: string;
    /** ID of an MDX material shown in the editor; resolved to Content or Transcript. */
    materialId?: string;
    /** Fixed trailing label for pages below the deepest entity. */
    current?: string;
};

const CURRENT_LABELS: Record<string, string> = {
    "course-details": "Course details",
    "seminar-cohort-details": "Cohort details",
    "lesson-content": "Content",
    "lesson-transcript": "Transcript",
    "seminar-content": "Content",
    "seminar-transcript": "Transcript",
};

/**
 * Maps the path segments below /admin/courses onto route IDs, mirroring the
 * folder structure under app/(admin)/admin/courses.
 */
function parseSegments(segments: string[]): ParsedRoute {
    const [courseId, section, sectionId, sub, subId, leaf, leafId] = segments;

    if (courseId === "new") return { current: "New course" };
    const route: ParsedRoute = { courseId };

    if (section === "course-details") {
        route.current = CURRENT_LABELS[section];
    } else if (section === "lessons") {
        if (sectionId === "new") {
            route.current = "New lesson";
        } else {
            route.lessonId = sectionId;
            if (sub === "lesson-material") route.materialId = subId;
            else if (sub) route.current = CURRENT_LABELS[sub];
        }
    } else if (section === "seminar-cohort") {
        route.seminarCohortId = sectionId;
        if (sub === "seminar-cohort-details") {
            route.current = CURRENT_LABELS[sub];
        } else if (sub === "seminars") {
            route.seminarId = subId;
            if (leaf === "seminar-material") route.materialId = leafId;
            else if (leaf) route.current = CURRENT_LABELS[leaf];
        }
    }
    return route;
}

/**
 * Breadcrumbs for /admin/courses/** pages, rendered once by the courses layout
 * via the @breadcrumbs slot so their position is identical on every page.
 */
export async function AdminCourseBreadcrumbs({
    segments,
}: {
    segments: string[];
}) {
    const {
        courseId,
        lessonId,
        seminarCohortId,
        seminarId,
        materialId,
        current,
    } = parseSegments(segments);

    const crumbs: Crumb[] = [
        { key: "courses", title: "Courses", href: "/admin" },
    ];

    if (courseId) {
        const { course, lesson, seminarCohort, seminar, isTranscript } =
            await dbGetAdminCourseBreadcrumbNames({
                courseId,
                lessonId,
                seminarCohortId,
                seminarId,
                materialId,
            });

        const courseHref = `/admin/courses/${courseId}`;
        crumbs.push({
            key: courseId,
            title: course?.name ?? "Course",
            href: courseHref,
        });

        if (lessonId) {
            crumbs.push({
                key: lessonId,
                title: lesson ? `Lesson: ${lesson.name}` : "Lesson",
                href: `${courseHref}/lessons/${lessonId}`,
            });
        }

        if (seminarCohortId) {
            const cohortHref = `${courseHref}/seminar-cohort/${seminarCohortId}`;
            crumbs.push({
                key: seminarCohortId,
                title: seminarCohort
                    ? `${seminarCohort.year} Cohort`
                    : "Cohort",
                href: cohortHref,
            });

            if (seminarId) {
                crumbs.push({
                    key: seminarId,
                    title: seminar ? `Seminar ${seminar.order}` : "Seminar",
                    href: `${cohortHref}/seminars/${seminarId}`,
                });
            }
        }

        if (materialId) {
            crumbs.push({
                key: materialId,
                title: isTranscript ? "Transcript" : "Content",
                href: "",
            });
        }
    }

    if (current) {
        crumbs.push({ key: "current", title: current, href: "" });
    }

    return <BreadcrumbTrail crumbs={crumbs} />;
}
