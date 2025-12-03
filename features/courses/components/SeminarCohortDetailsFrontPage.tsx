import { MDXRenderer } from "lib/components/MDXRenderer";
import type { dbGetSeminarCohortByCourseYearAndUser } from "lib/database/dbFuncs";
import { Heading } from "lib/components/ui/Heading";
import { Paragraph } from "lib/components/ui/Paragraph";
import { Back } from "lib/components/navigation/Back";
import { TableOfSeminarCohorts } from "./TableOfSeminarCohorts";

export async function SeminarCohortDetailsFrontPage({
    seminarCohort,
}: {
    seminarCohort: NonNullable<
        Awaited<ReturnType<typeof dbGetSeminarCohortByCourseYearAndUser>>
    >;
}) {
    const md = "md:grid md:grid-cols-4 md:items-start";
    const lg = "lg:grid-cols-6";
    const xl = "";
    const xxl = "2xl:px-20";

    return (
        <div
            className={`flex flex-col justify-center items-center ${md} ${lg} ${xl} ${xxl} mb-20 min-h-screen`}
        >
            <div className="min-h-[500px] flex flex-col w-full md:col-span-3 md:order-2">
                <div className="py-3">
                    <Heading as="h3">Seminar Information</Heading>
                    <Paragraph className="!text-center">
                        {seminarCohort.course.name} {seminarCohort.year}
                    </Paragraph>
                </div>

                {seminarCohort?.details?.mdxCompiled ? (
                    <MDXRenderer
                        data={seminarCohort.details.mdxCompiled}
                        isFullWidth
                    />
                ) : (
                    <div x-data-label="No content available"></div>
                )}
            </div>
            <div className="md:col-span-1 md:p-2 md:order-1 flex justify-end w-full">
                <div className="lg:fixed w-full md:max-w-[175px] 2xl:max-w-[300px] lg:pr-2 my-2">
                    <div className="flex md:flex-col justify-evenly flex-wrap md:flex-nowrap">
                        <Back
                            href={`/courses/${seminarCohort.course.slug}`}
                            text={`Back to ${seminarCohort.course.name}`}
                        />
                        <TableOfSeminarCohorts
                            courseSlug={seminarCohort.course.slug}
                            isCentered
                        />
                    </div>
                </div>
            </div>
            <div className="w-full px-2 md:px-0 md:w-auto md:col-span-4 md:m-4 md:order-3 lg:col-span-2">
                {/* Placeholder */}
            </div>
        </div>
    );
}
