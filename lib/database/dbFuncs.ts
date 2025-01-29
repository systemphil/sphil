import * as z from "zod";
import {
    Course,
    CourseDetails,
    Lesson,
    LessonContent,
    LessonTranscript,
    Video,
} from "@prisma/client";
import { prisma } from "./dbInit";
import { exclude } from "lib/utils";
import { mdxCompiler } from "lib/server/mdxCompiler";
import { withAdmin, withUser } from "lib/auth/authFuncs";
import {
    cache,
    CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS,
} from "lib/server/cache";

/**
 * Calls the database to retrieve all courses.
 * @access ADMIN
 */
export const dbGetAllCourses = () => withAdmin(() => prisma.course.findMany());

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
        ["allPublicCurses"],
        { revalidate: CACHE_REVALIDATION_INTERVAL_COURSES_AND_LESSONS }
    );
    return await getAllCourses();
};
/**
 * Calls the database to retrieve specific course by slug identifier
 */
export const dbGetCourseBySlug = async (slug: string) => {
    const validSlug = z.string().parse(slug);
    return await prisma.course.findUnique({
        where: {
            slug: validSlug,
        },
        include: {
            lessons: {
                select: {
                    slug: true,
                    name: true,
                },
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
};
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
    const res = await prisma.user.findUnique({
        where: {
            id: validUserId,
        },
        select: {
            coursesPurchased: true,
        },
    });
    if (!res) return null;
    const courses = res.coursesPurchased;
    return courses;
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
/**
 * Gets user data by id. Returns an object.
 */
export async function dbUpdateUserPurchases({
    userId,
    courseId,
    purchasePriceId,
}: {
    userId: string;
    courseId: string;
    purchasePriceId: string;
}) {
    const validUserId = z.string().parse(userId);
    const existingUser = await prisma.user.findUnique({
        where: { id: validUserId },
    });
    if (!existingUser) throw new Error("User not found");

    const purchasePriceIdWithTimeStamp = `${purchasePriceId}:${Date.now()}`;

    const updatedPurchases = [
        ...existingUser.productsPurchased,
        purchasePriceIdWithTimeStamp,
    ];
    const updatedUser = await prisma.user.update({
        where: {
            id: validUserId,
        },
        data: {
            coursesPurchased: {
                connect: { id: courseId },
            },
            productsPurchased: updatedPurchases,
        },
    });
    return updatedUser;
}
/**
 * Calls the database to retrieve specific course, its course details and lessons by id identifier.
 * @access ADMIN
 */
export async function dbGetCourseAndDetailsAndLessonsById(id: string) {
    async function task() {
        const validId = z.string().parse(id);
        return await prisma.course.findFirst({
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
/**
 * Calls the database to retrieve mdx field by id of the model as identifier.
 * Converts binary content of found record to string so that it can pass the tRPC network boundary
 * and/or be passed down to Client Components from Server Components.
 * @supports LessonContent | LessonTranscript | CourseDetails
 * TODO fixme! Auth guard this
 */
export const dbGetMdxByModelId = async (id: string) => {
    const validId = z.string().parse(id);
    /**
     * tRPC cannot handle binary transmission, so the buffer from each below must be converted to string.
     * And then new object is made from shallow copy of the result with the updated content field.
     *
     * First we look for a match in the LessonContent Model
     */
    const lessonContent = await prisma.lessonContent.findUnique({
        where: {
            id: validId,
        },
    });
    if (!lessonContent) {
        /**
         * If no matching id found, proceed to query LessonTranscript.
         */
        const lessonTranscript = await prisma.lessonTranscript.findUnique({
            where: {
                id: validId,
            },
        });
        if (!lessonTranscript) {
            /**
             * If no matching id found, proceed to query CourseDetails.
             */
            const courseDetails = await prisma.courseDetails.findUnique({
                where: {
                    id: validId,
                },
            });
            /**
             * All three query attempts failed, throw error.
             */
            if (!courseDetails)
                throw new Error(
                    "No lessonTranscript, lessonContent or courseDetails found at db call"
                );
            /**
             * Resolve third attempt if query successful.
             */
            const courseDetailsContentAsString = courseDetails.mdx.toString();
            const newResult = {
                ...courseDetails,
                mdx: courseDetailsContentAsString,
            };
            return newResult;
        }
        /**
         * Resolve second attempt if query successful.
         */
        const transcriptAsString = lessonTranscript.mdx.toString();
        const newResult = {
            ...lessonTranscript,
            mdx: transcriptAsString,
        };
        return newResult;
    }
    /**
     * Resolve first attempt if query successful.
     */
    const contentAsString = lessonContent.mdx.toString();
    const newResult = {
        ...lessonContent,
        mdx: contentAsString,
    };
    return newResult;
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
export type DbUpsertCourseByIdProps = Omit<
    Course,
    "id" | "createdAt" | "updatedAt"
> & { id?: string };
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
        } else {
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

        const contentAsBuffer = Uint8Array.from(content);

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

        const contentAsBuffer = Uint8Array.from(transcript);

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

        const contentAsBuffer = Uint8Array.from(content);

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
/**
 * Updates mdx field for an existing model by id as identifier.
 * @access ADMIN
 */
export const dbUpdateMdxByModelId = async ({
    id,
    content,
}: {
    id: LessonContent["id"] | LessonTranscript["id"] | CourseDetails["id"];
    content: string;
}) => {
    async function task() {
        const validId = z.string().parse(id);
        const validContent = z.string().parse(content);

        const contentAsBuffer = Buffer.from(validContent, "utf-8");
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
 * Deletes entry from the Video model. Returns only id of deleted model.
 * @note This function DOES NOT delete video from storage. Consider using `orderDeleteVideo()` instead.
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

/**
 * @access USER
 */
export async function dbVerifyUserPurchase(userId: string, priceId: string) {
    async function task() {
        const validUserId = z.string().parse(userId);
        const validPriceId = z.string().parse(priceId);
        const completePriceId = "price_" + validPriceId;
        const user = await prisma.user.findUnique({
            where: {
                id: validUserId,
            },
            select: {
                productsPurchased: true,
            },
        });
        if (!user) return false;
        const userPurchasedPriceIds = user.productsPurchased.map((id) => {
            return id.split(":")[0];
        });
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

export async function dbGetAllUsersWithPurchase() {
    return await prisma.user.findMany({
        where: {
            productsPurchased: {
                isEmpty: false,
            },
        },
    });
}
