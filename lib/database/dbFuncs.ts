import * as z from "zod";
import type {
    Course,
    CourseDetails,
    Lesson,
    LessonContent,
    LessonTranscript,
    MdxCategory,
    ProductsAuxiliary,
    Seminar,
    SeminarCohort,
    SeminarContent,
    SeminarTranscript,
    SeminarVideo,
    Video,
} from "@prisma/client";
import { prisma } from "./dbInit";
import { exclude } from "lib/utils";
import { mdxCompiler } from "lib/server/mdxCompiler";
import { withAdmin, withUser } from "lib/auth/authFuncs";
import {
    cache,
    CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS,
    cacheKeys,
} from "lib/server/cache";
import { Text } from "lib/utils/textEncoding";
import { stripeCreatePrice, stripeCreateProduct } from "lib/stripe/stripeFuncs";
import { AUXILIARY_PRODUCTS_DEFAULTS } from "lib/config/auxiliaryProductDefaults";

/**
 * Calls the database to retrieve all courses.
 * @access ADMIN
 */
export const dbGetAllCourses = () => withAdmin(() => prisma.course.findMany());

/**
 * Calls the database to retrieve all courses by owner userId.
 * @access ADMIN
 */
export const dbGetAllCoursesByCreatorsOrTutors = (userId: string) =>
    withAdmin(() => {
        return prisma.course.findMany({
            where: {
                OR: [
                    { creators: { some: { id: userId } } },
                    { assistants: { some: { id: userId } } },
                ],
            },
        });
    });

/**
 * Calls the database to retrieve all published courses.
 * @cache `allPublicCourses`
 */
export const dbGetAllPublishedCourses = async () => {
    const getAllCourses = cache(
        async () => {
            return await prisma.course.findMany({
                where: {
                    published: true,
                },
            });
        },
        [cacheKeys.allPublicCourses],
        { revalidate: CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS }
    );
    return await getAllCourses();
};

/**
 * Calls the database to retrieve specific course by slug identifier
 * @cached
 */
export const dbGetCourseBySlug = async (slug: string) => {
    const validSlug = z.string().parse(slug);
    // const getCourseCached = cache(
    //     async () => {
    return await prisma.course.findUnique({
        where: {
            slug: validSlug,
        },
        include: {
            lessons: {
                orderBy: {
                    order: "asc",
                },
            },
            details: {
                select: {
                    mdxCompiled: true,
                },
            },
        },
    });
    // },
    // [cacheKeys.allPublicCourses, validSlug],
    // { revalidate: CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS }
    // );
    // return await getCourseCached();
};

export async function dbGetSeminarCohortsByCourseAndUser({
    courseId,
    userId,
}: {
    courseId: string;
    userId: string;
}) {
    // const _task = cache(
    //     async () => {
    return await prisma.seminarCohort.findMany({
        where: {
            courseId,
            participants: {
                some: {
                    id: userId,
                },
            },
        },
        include: {
            seminars: true,
            details: true,
        },
    });
    //     },
    //     [cacheKeys.allSeminars, userId],
    //     { revalidate: CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS }
    // );
    // return await _task();
}

export async function dbGetSeminarCohortByCourseYearAndUser({
    courseId,
    userId,
    year,
}: {
    courseId: string;
    userId: string;
    year: number;
}) {
    // const _task = cache(
    //     async () => {
    return await prisma.seminarCohort.findFirst({
        where: {
            courseId,
            year,
            participants: {
                some: {
                    id: userId,
                },
            },
        },
        include: {
            seminars: true,
            details: true,
            course: {
                select: {
                    name: true,
                    slug: true,
                },
            },
        },
    });
    //     },
    //     [cacheKeys.allSeminars, userId],
    //     { revalidate: CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS }
    // );
    // return await _task();
}

export async function dbGetSeminarAndConnectedByYearAndUser({
    seminarOrder,
    year,
    userId,
    courseSlug,
}: {
    seminarOrder: number;
    year: number;
    userId: string;
    courseSlug: string;
}) {
    return await prisma.seminar.findFirst({
        where: {
            seminarCohort: {
                participants: {
                    some: {
                        id: userId,
                    },
                },
                year,
                course: {
                    slug: courseSlug,
                },
            },
            order: seminarOrder,
        },
        select: {
            content: true,
            seminarCohort: {
                include: {
                    course: {
                        select: {
                            slug: true,
                            name: true,
                        },
                    },
                },
            },
            transcript: true,
            video: true,
            order: true,
            id: true,
            published: true,
            seminarCohortId: true,
        },
    });
}
/**
 * Calls the database to retrieve specific course by id identifier
 */
export const dbGetCourseById = async (id: string) => {
    const validId = z.string().parse(id);
    return await prisma.course.findUnique({
        where: {
            id: validId,
        },
    });
};
/**
 * Gets all the courses that the user has purchased. Returns an array of objects.
 */
export async function dbGetUserPurchasedCourses(userId: string) {
    const validUserId = z.string().parse(userId);

    const res = await prisma.coursePurchase.findMany({
        where: {
            userId: validUserId,
        },
        select: {
            course: true,
        },
    });
    if (res && res.length > 0) {
        const courses = res.map((i) => i.course);
        return courses;
    }

    return [];
}
/**
 * Gets user data by id. Returns an object.
 */
export async function dbGetUserData(userId: string) {
    const validUserId = z.string().parse(userId);
    return await prisma.user.findUnique({
        where: {
            id: validUserId,
        },
    });
}
/**
 * Gets user data by id. Returns an object.
 */
export async function dbUpdateUserStripeCustomerId({
    userId,
    stripeCustomerId,
}: {
    userId: string;
    stripeCustomerId: string;
}) {
    const validUserId = z.string().parse(userId);
    const validStripeCustomerId = z.string().parse(stripeCustomerId);
    return await prisma.user.update({
        where: {
            id: validUserId,
        },
        data: {
            stripeCustomerId: validStripeCustomerId,
        },
    });
}

export async function dbCreateCoursePurchase({
    userId,
    courseId,
}: {
    userId: string;
    courseId: string;
}) {
    const validUserId = z.string().parse(userId);

    await prisma.coursePurchase.create({
        data: {
            user: { connect: { id: validUserId } },
            course: { connect: { id: courseId } },
        },
    });

    return;
}
/**
 * Calls the database to retrieve specific course, its course details and lessons by id identifier.
 * @access ADMIN
 */
export async function dbGetCourseAndDetailsAndLessonsById(id: string) {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.course.findUnique({
            where: {
                id: validId,
            },
            include: {
                lessons: {
                    orderBy: {
                        order: "asc",
                    },
                },
                details: {
                    select: {
                        id: true,
                    },
                },
                assistants: {
                    select: {
                        id: true,
                    },
                },
                creators: {
                    select: {
                        id: true,
                    },
                },
                seminarCohorts: {
                    orderBy: {
                        year: "desc",
                    },
                },
            },
        });
    }
    return withAdmin(task);
}
/**
 * Calls the database to retrieve specific lesson and relations by id identifier.
 * Does not include fields with byte objects, only plain objects.
 * @access ADMIN
 */
export const dbGetLessonAndRelationsById = async (id: string) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.lesson.findFirst({
            where: {
                id: validId,
            },
            include: {
                part: true,
                content: {
                    select: {
                        id: true,
                        lessonId: true,
                    },
                },
                transcript: {
                    select: {
                        id: true,
                        lessonId: true,
                    },
                },
                video: true,
            },
        });
    }
    return withAdmin(task);
};
/**
 * Calls the database to retrieve specific lesson and relations by id identifier.
 * Comes back with Video entry, and LessonContent and LessonTranscript entries with mdx field as string,
 * as well as the name and slug of the course the lesson is attached to.
 * @note To be used for LessonFrontPage
 */
export const dbGetLessonAndRelationsBySlug = async (slug: string) => {
    const validSlug = z.string().parse(slug);
    return await prisma.lesson.findFirst({
        where: {
            slug: validSlug,
        },
        include: {
            part: true,
            content: {
                select: {
                    mdxCompiled: true,
                },
            },
            transcript: {
                select: {
                    mdxCompiled: true,
                },
            },
            video: true,
            course: {
                select: {
                    name: true,
                    slug: true,
                    lessons: {
                        select: {
                            slug: true,
                            name: true,
                        },
                        orderBy: {
                            order: "asc",
                        },
                    },
                },
            },
        },
    });
};
type MdxModel = {
    id: string;
    mdx: Uint8Array<ArrayBufferLike>;
    mdxCategory: MdxCategory;
    [key: string]: unknown;
};

// Configuration for different model types
const mdxModelConfig = [
    {
        name: "lessonContent",
        query: (id: string) =>
            prisma.lessonContent.findUnique({ where: { id } }),
        description: "LessonContent",
    },
    {
        name: "lessonTranscript",
        query: (id: string) =>
            prisma.lessonTranscript.findUnique({ where: { id } }),
        description: "LessonTranscript",
    },
    {
        name: "courseDetails",
        query: (id: string) =>
            prisma.courseDetails.findUnique({ where: { id } }),
        description: "CourseDetails",
    },
    {
        name: "seminarContent",
        query: (id: string) =>
            prisma.seminarContent.findUnique({ where: { id } }),
        description: "SeminarContent",
    },
    {
        name: "seminarTranscript",
        query: (id: string) =>
            prisma.seminarTranscript.findUnique({ where: { id } }),
        description: "SeminarTranscript",
    },
    {
        name: "seminarCohortDetails",
        query: (id: string) =>
            prisma.seminarCohortDetails.findUnique({ where: { id } }),
        description: "SeminarCohortDetails",
    },
] as const;

/**
 * Converts binary MDX content to string for a given model record
 */
const convertMdxToString = <T extends MdxModel>(
    record: T
): T & { mdx: string } => {
    const mdxAsString = Text.Decode(record.mdx);
    return {
        ...record,
        mdx: mdxAsString,
    };
};
/**
 * Calls the database to retrieve mdx field by id across multiple models.
 * Converts binary content of found record to string for tRPC compatibility
 * and/or to be passed down to Client Components from Server Components.
 * @supports LessonContent | LessonTranscript | CourseDetails | SeminarContent | SeminarTranscript
 */
export const dbGetMdxByModelId = async (id: string) => {
    const validId = z.string().parse(id);

    // Try each model in sequence until we find a match
    for (const config of mdxModelConfig) {
        const result = await config.query(validId);

        if (result) {
            return convertMdxToString(result as MdxModel);
        }
    }

    // If no record found in any model, throw error
    const modelNames = mdxModelConfig
        .map((config) => config.description)
        .join(", ");
    throw new Error(
        `No record found with id "${validId}" in any of: ${modelNames}`
    );
};

export type DBGetMdxContentByModelIdReturnType = Awaited<
    ReturnType<typeof dbGetMdxByModelId>
>;
export type LessonTypes = "CONTENT" | "TRANSCRIPT";
export type DBGetCompiledMdxBySlugsProps = {
    courseSlug: string;
    partSlug?: string;
} & (
    | {
          lessonSlug: string;
          lessonType: LessonTypes;
      }
    | {
          lessonSlug?: never;
          lessonType?: never;
      }
);
/**
 * Get compiled MDX by Course slug and/or Lesson slug. If only Course slug is provided, the
 * function will attempt to find and retrieve the MDX of the CourseDetails that is
 * related to this course. To get the MDX pertaining to a Lesson, a lessonType must
 * be specified.
 * @returns compiled MDX string OR compiled placeholder string if data model non-existent
 */
export const dbGetCompiledMdxBySlugs = async ({
    courseSlug,
    lessonSlug,
    lessonType,
    partSlug,
}: DBGetCompiledMdxBySlugsProps): Promise<string> => {
    const validCourseSlug = z.string().parse(courseSlug);
    const validLessonSlug = z.string().optional().parse(lessonSlug);
    const defaultMdx = `
        /*@jsxRuntime automatic @jsxImportSource react*/
        const {jsx: _jsx} = arguments[0];
        function _createMdxContent(props) {
            return _jsx("p", {
                children: "Coming soon..."
            });
        }
        function MDXContent(props = {}) {
            const {wrapper: MDXLayout} = props.components || ({});
            return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
                children: _jsx(_createMdxContent, props)
            })) : _createMdxContent(props);
        }
        return {
            default: MDXContent
        };
    `;
    /**
     * Since a Course may exist without CourseDetails, and Lesson may exist
     * without LessonContent and LessonTranscript, instead of throwing an error
     * a pre-compiled placeholder is returned while the respective MDX data models are non-existent.
     */
    if (validCourseSlug && validLessonSlug && lessonType) {
        if (lessonType === "CONTENT") {
            const lessonContentMdx = await prisma.lessonContent.findFirst({
                where: {
                    lesson: {
                        slug: validLessonSlug,
                        course: {
                            slug: validCourseSlug,
                        },
                    },
                },
                select: {
                    mdxCompiled: true,
                },
            });
            if (!lessonContentMdx || lessonContentMdx.mdxCompiled === null)
                return defaultMdx;
            return lessonContentMdx.mdxCompiled;
        }
        if (lessonType === "TRANSCRIPT") {
            const lessonTranscriptMdx = await prisma.lessonTranscript.findFirst(
                {
                    where: {
                        lesson: {
                            slug: validLessonSlug,
                            course: {
                                slug: validCourseSlug,
                            },
                        },
                    },
                    select: {
                        mdxCompiled: true,
                    },
                }
            );
            if (
                !lessonTranscriptMdx ||
                lessonTranscriptMdx.mdxCompiled === null
            )
                return defaultMdx;
            return lessonTranscriptMdx.mdxCompiled;
        }
    }
    if (validCourseSlug) {
        const courseDetailsMdx = await prisma.courseDetails.findFirst({
            where: {
                course: {
                    slug: validCourseSlug,
                },
            },
            select: {
                mdxCompiled: true,
            },
        });
        if (!courseDetailsMdx || courseDetailsMdx.mdxCompiled === null)
            return defaultMdx;
        return courseDetailsMdx.mdxCompiled;
    }
    throw new Error(
        "Error occurred when attempting to find data models by slug(s)"
    );
};
/**
 * Calls the database to retrieve specific Video entry based on the ID of the Lesson it is related to.
 * Returns null when either Lesson or its related Video is not found.
 * @access ADMIN
 */
export const dbGetVideoByLessonId = async (id: string) => {
    async function task() {
        const validId = z.string().parse(id);
        const lessonWithVideo = await prisma.lesson.findUnique({
            where: {
                id: validId,
            },
            include: {
                video: true,
            },
        });
        if (lessonWithVideo) {
            if (lessonWithVideo.video) {
                return lessonWithVideo.video;
            }
            return null;
        }
        return null;
    }
    return withAdmin(task);
};

/**
 * Calls the database to retrieve specific SeminarVideo entry based on the ID of the Seminar it is related to.
 * Returns null when either Seminar or its related Video is not found.
 * @access ADMIN
 */
export const dbGetSeminarVideoBySeminarId = async (id: string) => {
    async function task() {
        const validId = z.string().parse(id);
        const lessonWithVideo = await prisma.seminar.findUnique({
            where: {
                id: validId,
            },
            include: {
                video: true,
            },
        });
        if (lessonWithVideo) {
            if (lessonWithVideo.video) {
                return lessonWithVideo.video;
            }
            return null;
        }
        return null;
    }
    return withAdmin(task);
};

/**
 * Calls the database to retrieve specific video.fileName by id identifier.
 * @access ADMIN
 */
export const dbGetVideoFileNameByVideoId = async (id: string) => {
    async function task() {
        const validId = z.string().parse(id);
        const video = await prisma.video.findUnique({
            where: {
                id: validId,
            },
            select: {
                fileName: true,
            },
        });
        return video;
    }
    return withAdmin(task);
};

/**
 * Calls the database to retrieve specific seminarVideo.fileName by id identifier.
 * @access ADMIN
 */
export const dbGetSeminarVideoFileNameByVideoId = async (id: string) => {
    async function task() {
        const validId = z.string().parse(id);
        const video = await prisma.seminarVideo.findUnique({
            where: {
                id: validId,
            },
            select: {
                fileName: true,
            },
        });
        return video;
    }
    return withAdmin(task);
};

export type DbUpsertCourseByIdProps = Omit<
    Course,
    "id" | "createdAt" | "updatedAt"
> & { id?: string; creatorId: string };
/**
 * Updates an existing course details by id as identifier or creates a new one if id is not provided.
 * @access ADMIN
 */
export const dbUpsertCourseById = async ({
    id,
    name,
    description,
    slug,
    stripeProductId,
    stripeBasePriceId,
    stripeSeminarPriceId,
    stripeDialoguePriceId,
    imageUrl,
    published,
    author,
    basePrice,
    seminarPrice,
    dialoguePrice,
    baseAvailability,
    seminarAvailability,
    dialogueAvailability,
    infoboxTitle,
    infoboxDescription,
    creatorId,
}: DbUpsertCourseByIdProps) => {
    async function task() {
        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validName = z.string().parse(name);
        const validDescription = z.string().parse(description);
        const validSlug = z.string().toLowerCase().parse(slug);
        const validProductId = stripeProductId
            ? z.string().parse(stripeProductId)
            : undefined;
        const validBasePriceId = stripeBasePriceId
            ? z.string().parse(stripeBasePriceId)
            : undefined;
        const validStripeSeminarPriceId = stripeSeminarPriceId
            ? z.string().parse(stripeSeminarPriceId)
            : undefined;
        const validStripeDialoguePriceId = stripeDialoguePriceId
            ? z.string().parse(stripeDialoguePriceId)
            : undefined;
        const validBasePrice = z.number().parse(basePrice);
        const validSeminarPrice = z.number().parse(seminarPrice);
        const validDialoguePrice = z.number().parse(dialoguePrice);
        const validImageUrl = imageUrl
            ? z.string().url().parse(imageUrl)
            : undefined;
        const validAuthor = author ? z.string().parse(author) : undefined;
        const validPublished = published
            ? z.boolean().parse(published)
            : undefined;
        const validBaseAvailability = z.date().parse(baseAvailability);
        const validSeminarAvailability = z.date().parse(seminarAvailability);
        const validDialogueAvailability = z.date().parse(dialogueAvailability);
        const validInfoboxTitle = z.string().nullish().parse(infoboxTitle);
        const validInfoboxDescription = z
            .string()
            .nullish()
            .parse(infoboxDescription);

        return await prisma.course.upsert({
            where: {
                id: validId,
            },
            update: {
                name: validName,
                slug: validSlug,
                description: validDescription,
                stripeProductId: validProductId,
                stripeBasePriceId: validBasePriceId,
                stripeSeminarPriceId: validStripeSeminarPriceId,
                stripeDialoguePriceId: validStripeDialoguePriceId,
                basePrice: validBasePrice,
                seminarPrice: validSeminarPrice,
                dialoguePrice: validDialoguePrice,
                imageUrl: validImageUrl,
                author: validAuthor,
                published: validPublished,
                baseAvailability: validBaseAvailability,
                seminarAvailability: validSeminarAvailability,
                dialogueAvailability: validDialogueAvailability,
                infoboxTitle: validInfoboxTitle,
                infoboxDescription: validInfoboxDescription,
                creators: {
                    connect: {
                        id: creatorId,
                    },
                },
            },
            create: {
                name: validName,
                slug: validSlug,
                description: validDescription,
                stripeProductId: validProductId,
                stripeBasePriceId: validBasePriceId,
                stripeSeminarPriceId: validStripeSeminarPriceId,
                stripeDialoguePriceId: validStripeDialoguePriceId,
                basePrice: validBasePrice,
                seminarPrice: validSeminarPrice,
                dialoguePrice: validDialoguePrice,
                imageUrl: validImageUrl,
                author: validAuthor,
                published: validPublished,
                baseAvailability: validBaseAvailability,
                seminarAvailability: validSeminarAvailability,
                dialogueAvailability: validDialogueAvailability,
                infoboxTitle: validInfoboxTitle,
                infoboxDescription: validInfoboxDescription,
                creators: {
                    connect: {
                        id: creatorId,
                    },
                },
            },
        });
    }
    return withAdmin(task);
};
/**
 * Updates an existing lesson details by id as identifier or creates a new one if id is not provided.
 * @access ADMIN
 */
export const dbUpsertLessonById = async ({
    id,
    name,
    description,
    slug,
    partId,
    courseId,
}: {
    id?: string;
    slug: string;
    name: string;
    description: string;
    partId?: string | null;
    courseId: string | null;
}) => {
    async function findExistingLesson(id?: string) {
        if (!id) return null;

        const validId = z.string().parse(id);

        return prisma.lesson.findFirst({
            where: {
                id: validId,
            },
        });
    }

    async function task() {
        const validName = z.string().parse(name);
        const validDescription = z.string().parse(description);
        const validSlug = z.string().toLowerCase().parse(slug);
        const validPartId = partId ? z.string().parse(partId) : undefined;
        const validCourseId = z.string().parse(courseId);

        const existingLesson = await findExistingLesson(id);

        if (existingLesson) {
            return await prisma.lesson.update({
                where: {
                    id: existingLesson.id,
                },
                data: {
                    name: validName,
                    slug: validSlug,
                    description: validDescription,
                    partId: validPartId,
                },
            });
        }
        const allLessons = await prisma.lesson.findMany({
            select: {
                id: true,
            },
        });
        const totalLessonsPlusOne = allLessons.length + 1;

        return await prisma.lesson.create({
            data: {
                name: validName,
                description: validDescription,
                slug: validSlug,
                courseId: validCourseId,
                partId: validPartId,
                order: totalLessonsPlusOne,
            },
        });
    }
    return withAdmin(task);
};
/**
 * Reorders lessons by their position in the input array.
 */
export const dbReorderLessons = async ({
    orderedLessonIds,
}: {
    orderedLessonIds: string[];
}) => {
    await prisma.$transaction(async (tx) => {
        await Promise.all(
            orderedLessonIds.map((id, index) =>
                tx.lesson.updateMany({
                    where: { id },
                    data: { order: index + 1 },
                })
            )
        );
    });
    return;
};
/**
 * Reorders seminars by their position in the input array.
 */
export const dbReorderSeminars = async ({
    orderedIds,
}: {
    orderedIds: string[];
}) => {
    await prisma.$transaction(async (tx) => {
        await Promise.all(
            orderedIds.map((id, index) =>
                tx.seminar.updateMany({
                    where: { id },
                    data: { order: index + 1 },
                })
            )
        );
    });
    return;
};
/**
 * Updates an existing lessonContent details by id as identifier or creates a new one if id is not provided.
 * @access ADMIN
 */
export const dbUpsertLessonContentById = async ({
    id,
    lessonId,
    content,
}: {
    id?: LessonContent["id"];
    lessonId: LessonContent["lessonId"];
    content: string;
}) => {
    async function task() {
        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validLessonId = z.string().parse(lessonId);

        const contentAsBuffer = Text.Encode(content);

        const result = await prisma.lessonContent.upsert({
            where: {
                id: validId,
            },
            update: {
                mdx: contentAsBuffer,
            },
            create: {
                lessonId: validLessonId,
                mdx: contentAsBuffer,
            },
        });

        const resultWithoutContent = exclude(result, ["mdx"]);
        return resultWithoutContent;
    }
    return withAdmin(task);
};
/**
 * Updates an existing SeminarContent details by id as identifier or creates a new one if id is not provided.
 * @access ADMIN
 */
export const dbUpsertSeminarContentById = async ({
    id,
    seminarId,
    content,
}: {
    id?: SeminarContent["id"];
    seminarId: SeminarContent["seminarId"];
    content: string;
}) => {
    async function task() {
        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validSeminarId = z.string().parse(seminarId);

        const contentAsBuffer = Text.Encode(content);

        const result = await prisma.seminarContent.upsert({
            where: {
                id: validId,
            },
            update: {
                mdx: contentAsBuffer,
            },
            create: {
                seminarId: validSeminarId,
                mdx: contentAsBuffer,
            },
        });

        const resultWithoutContent = exclude(result, ["mdx"]);
        return resultWithoutContent;
    }
    return withAdmin(task);
};
/**
 * Updates an existing SeminarContent details by id as identifier or creates a new one if id is not provided.
 * @access ADMIN
 */
export const dbUpsertSeminarTranscriptById = async ({
    id,
    seminarId,
    content,
}: {
    id?: SeminarTranscript["id"];
    seminarId: SeminarTranscript["seminarId"];
    content: string;
}) => {
    async function task() {
        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validSeminarId = z.string().parse(seminarId);

        const contentAsBuffer = Text.Encode(content);

        const result = await prisma.seminarTranscript.upsert({
            where: {
                id: validId,
            },
            update: {
                mdx: contentAsBuffer,
            },
            create: {
                seminarId: validSeminarId,
                mdx: contentAsBuffer,
            },
        });

        const resultWithoutContent = exclude(result, ["mdx"]);
        return resultWithoutContent;
    }
    return withAdmin(task);
};
/**
 * Updates an existing LessonTranscript model by id as identifier or creates a new one if id is not provided.
 * Must have the id of the Lesson this LessonTranscript relates to.
 * @access ADMIN
 */
export const dbUpsertLessonTranscriptById = async ({
    id,
    lessonId,
    transcript,
}: {
    id?: LessonTranscript["id"];
    lessonId: LessonContent["lessonId"];
    transcript: string;
}) => {
    async function task() {
        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validLessonId = z.string().parse(lessonId);

        const contentAsBuffer = Text.Encode(transcript);

        const result = await prisma.lessonTranscript.upsert({
            where: {
                id: validId,
            },
            update: {
                mdx: contentAsBuffer,
            },
            create: {
                lessonId: validLessonId,
                mdx: contentAsBuffer,
            },
        });

        const resultWithoutTranscript = exclude(result, ["mdx"]);
        return resultWithoutTranscript;
    }
    return withAdmin(task);
};
/**
 * Updates an existing CourseDetails  model by id as identifier or creates a new one if id is not provided.
 * Must have the id of the Course this CourseDetails relates to.
 */
export const dbUpsertCourseDetailsById = async ({
    id,
    courseId,
    content,
}: {
    id?: CourseDetails["id"];
    courseId: Course["id"];
    content: string;
}) => {
    async function task() {
        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validCourseId = z.string().parse(courseId);

        const contentAsBuffer = Text.Encode(content);

        const result = await prisma.courseDetails.upsert({
            where: {
                id: validId,
            },
            update: {
                mdx: contentAsBuffer,
            },
            create: {
                courseId: validCourseId,
                mdx: contentAsBuffer,
            },
        });

        const resultWithoutContent = exclude(result, ["mdx"]);
        return resultWithoutContent;
    }
    return withAdmin(task);
};

export const dbUpsertSeminarCohortDetailsById = async ({
    id,
    seminarCohortId,
    content,
}: {
    id?: string;
    seminarCohortId: string;
    content: string;
}) => {
    async function task() {
        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validSeminarCourseId = z.string().parse(seminarCohortId);

        const contentAsBuffer = Text.Encode(content);

        const result = await prisma.seminarCohortDetails.upsert({
            where: {
                id: validId,
            },
            update: {
                mdx: contentAsBuffer,
            },
            create: {
                seminarCohortId: validSeminarCourseId,
                mdx: contentAsBuffer,
            },
        });

        const resultWithoutContent = exclude(result, ["mdx"]);
        return resultWithoutContent;
    }
    return withAdmin(task);
};
/**
 * Updates mdx field for an existing model by id as identifier.
 * @access ADMIN
 */
export const dbUpdateMdxByModelId = async ({
    id,
    content,
}: {
    id: string;
    content: string;
}) => {
    async function task() {
        const validId = z.string().parse(id);
        const validContent = z.string().parse(content);

        const contentAsBuffer = Text.Encode(validContent);
        /**
         * Prisma does not allow us to traverse two tables at once, so we made SQL executions directly with $executeRaw where
         * prisma returns the number of rows affected by the query instead of an error in the usual prisma.update().
         * First we try to update one table where there is an id match, and, then, we check how many rows were affected.
         * If 1, then proceed to compile mdx string for user consumption and return, otherwise proceed to check the next table until ID hit.
         * @see {@link https://www.prisma.io/articles/concepts/components/prisma-client/raw-database-access#executeraw PrismaExecuteRaw}
         * @see {@link https://www.cockroachlabs.com/articles/stable/sql-statements SQL@CockroachDB}
         */
        let result: number =
            await prisma.$executeRaw`UPDATE "LessonContent" SET mdx = ${contentAsBuffer} WHERE id = ${validId};`;
        if (result === 1) {
            const compiledMdx = await mdxCompiler(validContent);
            await prisma.lessonContent.update({
                where: {
                    id: validId,
                },
                data: {
                    mdxCompiled: compiledMdx,
                },
            });
            return;
        }
        result =
            await prisma.$executeRaw`UPDATE "LessonTranscript" SET mdx = ${contentAsBuffer} WHERE id = ${validId};`;
        if (result === 1) {
            const compiledMdx = await mdxCompiler(validContent);
            await prisma.lessonTranscript.update({
                where: {
                    id: validId,
                },
                data: {
                    mdxCompiled: compiledMdx,
                },
            });
            return;
        }
        result =
            await prisma.$executeRaw`UPDATE "CourseDetails" SET mdx = ${contentAsBuffer} WHERE id = ${validId};`;
        if (result === 1) {
            const compiledMdx = await mdxCompiler(validContent);
            await prisma.courseDetails.update({
                where: {
                    id: validId,
                },
                data: {
                    mdxCompiled: compiledMdx,
                },
            });
            return;
        }
        result =
            await prisma.$executeRaw`UPDATE "SeminarContent" SET mdx = ${contentAsBuffer} WHERE id = ${validId};`;
        if (result === 1) {
            const compiledMdx = await mdxCompiler(validContent);
            await prisma.seminarContent.update({
                where: {
                    id: validId,
                },
                data: {
                    mdxCompiled: compiledMdx,
                },
            });
            return;
        }
        result =
            await prisma.$executeRaw`UPDATE "SeminarTranscript" SET mdx = ${contentAsBuffer} WHERE id = ${validId};`;
        if (result === 1) {
            const compiledMdx = await mdxCompiler(validContent);
            await prisma.seminarTranscript.update({
                where: {
                    id: validId,
                },
                data: {
                    mdxCompiled: compiledMdx,
                },
            });
            return;
        }
        result =
            await prisma.$executeRaw`UPDATE "SeminarCohortDetails" SET mdx = ${contentAsBuffer} WHERE id = ${validId};`;
        if (result === 1) {
            const compiledMdx = await mdxCompiler(validContent);
            await prisma.seminarCohortDetails.update({
                where: {
                    id: validId,
                },
                data: {
                    mdxCompiled: compiledMdx,
                },
            });
            return;
        }
        throw new Error(
            "Database update should have returned exactly 1 updated record."
        );
    }
    return withAdmin(task);
};
/**
 * Updates Video details by id as identifier or creates a new one if id is not provided, in which case
 * the id of the lesson this video is related to must be provided.
 * @access ADMIN
 */
export const dbUpsertVideoById = async ({
    id,
    lessonId,
    fileName,
}: {
    id?: string;
    lessonId: string;
    fileName?: string;
}) => {
    async function task() {
        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value in order to query
        const validLessonId = z.string().parse(lessonId);
        const validFileName = fileName ? z.string().parse(fileName) : "";

        return await prisma.video.upsert({
            where: {
                id: validId,
            },
            update: {
                fileName: validFileName,
            },
            create: {
                lessonId: validLessonId,
                fileName: validFileName,
            },
        });
    }
    return withAdmin(task);
};
/**
 * Updates Video details by id as identifier or creates a new one if id is not provided, in which case
 * the id of the lesson this video is related to must be provided.
 * @access ADMIN
 */
export const dbUpsertSeminarVideoById = async ({
    id,
    seminarId,
    fileName,
}: {
    id?: string;
    seminarId: string;
    fileName?: string;
}) => {
    async function task() {
        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value in order to query
        const validSeminarId = z.string().parse(seminarId);
        const validFileName = fileName ? z.string().parse(fileName) : "";

        return await prisma.seminarVideo.upsert({
            where: {
                id: validId,
            },
            update: {
                fileName: validFileName,
            },
            create: {
                seminarId: validSeminarId,
                fileName: validFileName,
            },
        });
    }
    return withAdmin(task);
};
/**
 * Deletes entry from the LessonTranscript model. Returns only id of deleted model.
 * @access ADMIN
 */
export const dbDeleteLessonTranscriptById = async ({
    id,
}: {
    id: LessonTranscript["id"];
}) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.lessonTranscript.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return withAdmin(task);
};
/**
 * Deletes entry from the LessonContent model. Returns only id of deleted model.
 * @access ADMIN
 */
export const dbDeleteLessonContentById = async ({
    id,
}: {
    id: LessonContent["id"];
}) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.lessonContent.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return withAdmin(task);
};
/**
 * Deletes entry from the LessonContent model. Returns only id of deleted model.
 * @access ADMIN
 */
export const dbDeleteSeminarContentById = async ({
    id,
}: {
    id: SeminarContent["id"];
}) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.seminarContent.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return withAdmin(task);
};
/**
 * Deletes entry from the LessonContent model. Returns only id of deleted model.
 * @access ADMIN
 */
export const dbDeleteSeminarTranscriptById = async ({
    id,
}: {
    id: SeminarTranscript["id"];
}) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.seminarTranscript.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return withAdmin(task);
};
/**
 * Deletes entry from the Video model. Returns only id of deleted model.
 * @note This function DOES NOT delete video from storage!
 * @access ADMIN
 */
export const dbDeleteVideoById = async ({ id }: { id: Video["id"] }) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.video.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return withAdmin(task);
};

/**
 * Deletes entry from the Video model. Returns only id of deleted model.
 * @note This function DOES NOT delete video from storage!
 * @access ADMIN
 */
export const dbDeleteSeminarVideoById = async ({
    id,
}: {
    id: SeminarVideo["id"];
}) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.seminarVideo.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return withAdmin(task);
};

/**
 * Deletes entry from the CourseDetails model. Returns only id of deleted model.
 * @access ADMIN
 */
export const dbDeleteCourseDetailsById = async ({
    id,
}: {
    id: CourseDetails["id"];
}) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.courseDetails.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return withAdmin(task);
};

export const dbDeleteSeminarCohortDetailsById = async ({
    id,
}: {
    id: string;
}) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.seminarCohortDetails.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return withAdmin(task);
};
/**
 * Deletes entry from the Lesson model (and all related models). Returns only id of deleted model.
 * @warning Does NOT delete video from storage. Consider using `ctrlDeleteVideo()` or `ctrlDeleteLesson()` instead.
 * @access ADMIN
 */
export const dbDeleteLesson = async ({ id }: { id: Lesson["id"] }) => {
    async function task() {
        const validId = z.string().parse(id);
        const deletedLesson = await prisma.$transaction(async (tx) => {
            // First, get the order and courseId of the lesson to be deleted
            const lessonToDelete = await tx.lesson.findUnique({
                where: { id: validId },
                select: { order: true, courseId: true, id: true },
            });

            if (!lessonToDelete) {
                throw new Error("Lesson not found");
            }

            // Delete the lesson
            await tx.lesson.delete({
                where: { id: validId },
            });

            // Update the order of remaining lessons
            await tx.lesson.updateMany({
                where: {
                    courseId: lessonToDelete.courseId,
                    order: { gt: lessonToDelete.order },
                },
                data: {
                    order: { decrement: 1 },
                },
            });
            return lessonToDelete;
        });
        return deletedLesson;
    }
    return withAdmin(task);
};

/**
 * Deletes entry from the Seminar model (and all related models). Returns only id of deleted model.
 * @warning Does NOT delete video from storage!
 * @access ADMIN
 */
export const dbDeleteSeminar = async ({ id }: { id: Seminar["id"] }) => {
    async function task() {
        const validId = z.string().parse(id);
        const deletedSeminar = await prisma.$transaction(async (tx) => {
            // First, get the order and seminarCohortId of the seminar to be deleted
            const seminarToDelete = await tx.seminar.findUnique({
                where: { id: validId },
                select: { order: true, seminarCohortId: true, id: true },
            });

            if (!seminarToDelete) {
                throw new Error("Lesson not found");
            }

            // Delete the seminar
            await tx.lesson.delete({
                where: { id: validId },
            });

            // Update the order of remaining seminars
            await tx.lesson.updateMany({
                where: {
                    courseId: seminarToDelete.seminarCohortId,
                    order: { gt: seminarToDelete.order },
                },
                data: {
                    order: { decrement: 1 },
                },
            });
            return seminarToDelete;
        });
        return deletedSeminar;
    }
    return withAdmin(task);
};

/**
 * Deletes entry from the Course model (and all related models, including CourseDetails). Returns only id of deleted model.
 * @warning Does NOT delete video from storage. Consider using `ctrlDeleteVideo()` or `ctrlDeleteLesson()` instead.
 * @access ADMIN
 */
export const dbDeleteCourse = async ({ id }: { id: Course["id"] }) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.course.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return withAdmin(task);
};

export const dbDeleteSeminarCohort = async ({ id }: { id: string }) => {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.seminarCohort.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return withAdmin(task);
};

/**
 * @access USER
 */
export async function dbVerifyUserPurchase(userId: string, priceId: string) {
    async function task() {
        const validUserId = z.string().parse(userId);
        const validPriceId = z.string().parse(priceId);
        const completePriceId = `price_${validPriceId}`;
        const user = await prisma.user.findUnique({
            where: {
                id: validUserId,
            },
            select: {
                purchases: {
                    select: {
                        course: {
                            select: {
                                stripeBasePriceId: true,
                                stripeDialoguePriceId: true,
                                stripeSeminarPriceId: true,
                            },
                        },
                    },
                },
            },
        });
        if (!user) {
            return false;
        }
        if (!user.purchases || user.purchases.length === 0) {
            return false;
        }

        const userPurchasedPriceIds = user.purchases
            .flatMap((p) => {
                return [
                    p.course.stripeBasePriceId,
                    p.course.stripeSeminarPriceId,
                    p.course.stripeDialoguePriceId,
                ];
            })
            .filter((priceId): priceId is string => priceId !== undefined);

        const hasUserPurchased =
            userPurchasedPriceIds.includes(completePriceId);
        return hasUserPurchased;
    }
    return withUser(task);
}

export async function dbGetMaintenanceMessageGlobal() {
    return await prisma.maintenanceMessage.findFirst({
        where: {
            area: "global",
            published: true,
        },
    });
}

export async function dbGetMaintenanceMessageUser() {
    return await prisma.maintenanceMessage.findFirst({
        where: {
            area: "user",
            published: true,
        },
    });
}

export async function dbCreateNewsletterEmail({ email }: { email: string }) {
    return await prisma.newsletterEmail.create({
        data: {
            email,
        },
    });
}

export async function dbDeleteNewsletterEmailIfExists({ id }: { id: string }) {
    const newsletter = await prisma.newsletterEmail.findFirst({
        where: {
            id,
        },
    });

    if (newsletter) {
        await prisma.newsletterEmail.delete({
            where: {
                id,
            },
        });
    }
}

export async function dbVerifyVideoToUserId({
    videoId,
    userId,
}: {
    videoId: string;
    userId: string;
}) {
    const res = await prisma.video.findFirst({
        where: {
            id: videoId,
        },
        select: {
            lesson: {
                select: {
                    course: {
                        select: {
                            purchases: {
                                select: {
                                    user: {
                                        select: {
                                            id: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });

    const purchases = res?.lesson?.course.purchases;

    if (!purchases || purchases.length === 0) {
        return false;
    }

    const ownersFlattened = purchases.flatMap((p) => p.user.id);

    if (ownersFlattened.includes(userId)) {
        return true;
    }

    return false;
}

export async function dbGetOrCreateProductAux({
    kind,
}: {
    kind: ProductsAuxiliary["kind"];
}) {
    function getProductName(kind: ProductsAuxiliary["kind"]) {
        switch (kind) {
            case "SEMINAR_ONLY":
                return AUXILIARY_PRODUCTS_DEFAULTS.seminarOnly;
            case "OTHER":
                return AUXILIARY_PRODUCTS_DEFAULTS.other;
            default: {
                const _exhaustiveTypeCheck: never = kind;
                throw new Error(`${_exhaustiveTypeCheck} not supported`);
            }
        }
    }

    const existingProduct = await prisma.productsAuxiliary.findFirst({
        where: {
            kind,
        },
    });

    if (existingProduct) {
        return existingProduct;
    }

    const { productName, defaultPriceCents, description, imageUrl } =
        getProductName(kind);

    const newStripeProduct = await stripeCreateProduct({
        name: productName,
        description,
        imageUrl,
    });

    const newStripePrice = await stripeCreatePrice({
        stripeProductId: newStripeProduct.id,
        unitPrice: defaultPriceCents,
    });

    return await prisma.productsAuxiliary.create({
        data: {
            stripePriceIdDefault: newStripePrice.id,
            priceDefault: defaultPriceCents,
            kind,
            stripeProductId: newStripeProduct.id,
        },
    });
}

/**
 * Creates a new seminar cohort if one does not exist for the current year for the provided courseId
 */
export async function dbEnrollUserInSeminarCohort({
    userId,
    courseId,
}: {
    userId: string;
    courseId: string;
}) {
    const currentYear = new Date().getFullYear();

    let cohort = await prisma.seminarCohort.findFirst({
        where: {
            year: currentYear,
            courseId: courseId,
        },
    });

    if (!cohort) {
        cohort = await dbCreateSeminarCohort({
            courseId,
            currentYear,
        });
    }

    // Avoid adding the user twice
    await prisma.seminarCohort.update({
        where: { id: cohort.id },
        data: {
            participants: {
                connect: { id: userId },
            },
        },
    });

    return cohort;
}

export async function dbCreateSeminarCohort({
    courseId,
    currentYear,
}: {
    courseId: string;
    currentYear: number;
}) {
    const productSeminar = await dbGetOrCreateProductAux({
        kind: "SEMINAR_ONLY",
    });

    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
    });

    if (!course) {
        throw new Error("Expected course");
    }

    const seminarUpgradeDelta = Math.round(
        course.seminarPrice - course.basePrice
    );

    if (seminarUpgradeDelta < 0) {
        throw new Error("Seminar price must be greater than base price.");
    }

    const upgradePrice = await stripeCreatePrice({
        stripeProductId: productSeminar.stripeProductId,
        unitPrice: seminarUpgradeDelta,
    });

    return await prisma.seminarCohort.create({
        data: {
            stripeSeminarUpgradePriceId: upgradePrice.id,
            seminarUpgradePrice: seminarUpgradeDelta,
            stripeSeminarOnlyPriceId: productSeminar.stripePriceIdDefault,
            seminarOnlyPrice: productSeminar.priceDefault,
            year: currentYear,
            course: { connect: { id: courseId } },
        },
    });
}

export async function dbGetSeminarCohortAndSeminarsById({
    id,
}: {
    id: string;
}) {
    // const _task = cache(
    //     async () => {
    return prisma.seminarCohort.findUnique({
        where: {
            id,
        },
        include: {
            seminars: {
                orderBy: {
                    order: "asc",
                },
            },
            details: true,
            course: {
                select: {
                    name: true,
                },
            },
            participants: {
                select: {
                    name: true,
                    email: true,
                },
            },
        },
    });
    //     },
    //     [cacheKeys.allSeminars],
    //     { revalidate: CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS }
    // );
    // return await _task();
}

export async function dbGetSeminarAndConnectedById({ id }: { id: string }) {
    const _task = cache(
        async () => {
            return await prisma.seminar.findUnique({
                where: {
                    id,
                },
                include: {
                    content: true,
                    transcript: true,
                    video: true,
                    seminarCohort: {
                        select: {
                            year: true,
                            course: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                },
            });
        },
        [cacheKeys.allSeminars],
        { revalidate: CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS }
    );
    return await _task();
}

export async function dbUpdateSeminarCohort({
    id,
    data,
}: {
    id: SeminarCohort["id"];
    data: Partial<Omit<SeminarCohort, "id">>;
}) {
    return await prisma.seminarCohort.update({
        where: {
            id,
        },
        data: {
            ...data,
        },
    });
}

export async function dbCreateSeminar({
    seminarCohortId,
}: {
    seminarCohortId: string;
}) {
    const existingSeminars = await prisma.seminar.findMany({
        where: {
            seminarCohortId,
        },
    });

    return await prisma.seminar.create({
        data: {
            order: existingSeminars.length + 1,
            seminarCohort: {
                connect: {
                    id: seminarCohortId,
                },
            },
        },
    });
}
