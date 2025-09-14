import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "lib/auth/authConfig";
import {
    dbGetCourseBySlug,
    dbGetUserPurchasedCourses,
} from "lib/database/dbFuncs";
import { Heading } from "lib/components/ui/Heading";
import { SubmitButton } from "lib/components/forms/SubmitButton";
import { SignInToBuyBtn } from "./SignInToBuyBtn";
import { ctrlCreateCheckout } from "lib/server/ctrl";
import Link from "next/link";
import { cn } from "lib/utils";

type CourseEnrollButtonProps = {
    slug: string;
};

const BASE_TIER_TITLE = "Self-study";
const BASE_TIER_TEXT =
    "Base tier grants lifetime access to the course and all its digital contents, including any future updates.";
const SEMINAR_TIER_TITLE = "Seminar";
const SEMINAR_TIER_TEXT =
    "Seminar tier includes base tier as well as one-time access to live seminars, valid only for the season in which your course is held.";
const DIALOGUE_TIER_TITLE = "Dialogue";
const DIALOGUE_TIER_TEXT =
    "Dialogue tier includes base and seminar tier as well as weekly 1:1 sessions with the teacher, valid only for the season in which your course is held. Limited slots.";

export async function CourseEnroll({ slug }: CourseEnrollButtonProps) {
    const course = await dbGetCourseBySlug(slug);
    if (!course) {
        return <div className="d-badge d-badge-error">n/a</div>;
    }
    const baseAvailable = course.baseAvailability
        ? new Date(course.baseAvailability) > new Date()
        : false;
    const seminarAvailable = course.seminarAvailability
        ? new Date(course.seminarAvailability) > new Date()
        : false;
    const dialogueAvailable = course.dialogueAvailability
        ? new Date(course.dialogueAvailability) > new Date()
        : false;

    const anyAvailable = baseAvailable || seminarAvailable || dialogueAvailable;
    const session = await auth();

    if (session) {
        const userCourses = await dbGetUserPurchasedCourses(session.user.id);
        if (
            !!userCourses &&
            userCourses.find((course) => course.slug === slug)
        ) {
            return <div className="invisible" x-data="Owned" />;
        }
    }

    async function handleEnroll(formData: FormData) {
        "use server";
        const rawFormData = {
            rawPriceTier: formData.get("price-tier") as string,
        };
        const priceTier = z
            .enum(["base", "seminar", "dialogue"])
            .parse(rawFormData.rawPriceTier);
        const { url } = await ctrlCreateCheckout(slug, priceTier);
        if (!url) throw new Error("Could not create checkout session");
        redirect(url);
    }

    return (
        <div className="border w-[300px] md:w-[200px] xl:w-[280px] flex flex-col justify-center items-center p-3 gap-2">
            <form
                action={handleEnroll}
                className="flex flex-col gap-2 justify-center  grow"
            >
                <p className="text-slate-800 dark:text-gray-300 font-bold">
                    Select your course tier
                </p>

                <div className="form-control has-checked:bg-indigo-50 has-checked:dark:bg-green-700/20 rounded-md relative">
                    <label
                        className={`d-label ${
                            baseAvailable && "cursor-pointer"
                        } relative`}
                    >
                        <input
                            type="radio"
                            name="price-tier"
                            className="d-radio checked:bg-red-500"
                            defaultChecked={baseAvailable}
                            value="base"
                            disabled={!baseAvailable}
                        />

                        <span
                            className={cn(
                                "d-label-text",
                                baseAvailable
                                    ? "dark:text-gray-300"
                                    : "text-slate-300/90 dark:text-gray-700 line-through"
                            )}
                        >
                            Base Tier
                        </span>
                    </label>
                    <TierDescription
                        isAvailable={baseAvailable}
                        title={BASE_TIER_TITLE}
                        text={BASE_TIER_TEXT}
                        price={course.basePrice}
                    />
                </div>
                <div className="form-control has-checked:bg-indigo-50 has-checked:dark:bg-green-700/20 rounded-md relative">
                    <label
                        className={`d-label ${
                            seminarAvailable && "cursor-pointer"
                        } relative`}
                    >
                        <input
                            type="radio"
                            name="price-tier"
                            className="d-radio checked:bg-blue-500"
                            value="seminar"
                            disabled={!seminarAvailable}
                        />

                        <span
                            className={cn(
                                "d-label-text",
                                seminarAvailable
                                    ? "dark:text-gray-300"
                                    : "text-slate-300/90 dark:text-gray-700 line-through"
                            )}
                        >
                            Seminar Tier
                        </span>
                    </label>
                    <TierDescription
                        isAvailable={seminarAvailable}
                        title={SEMINAR_TIER_TITLE}
                        text={SEMINAR_TIER_TEXT}
                        price={course.seminarPrice}
                    />
                </div>
                <div className="form-control has-checked:bg-indigo-50 has-checked:dark:bg-green-700/20 rounded-md relative">
                    <label
                        className={`d-label ${
                            dialogueAvailable && "cursor-pointer"
                        } relative`}
                    >
                        <input
                            type="radio"
                            name="price-tier"
                            className="d-radio checked:bg-green-600"
                            value="dialogue"
                            disabled={!dialogueAvailable}
                        />

                        <span
                            className={cn(
                                "d-label-text",
                                dialogueAvailable
                                    ? "dark:text-gray-300"
                                    : " text-slate-300/90 dark:text-gray-700 line-through"
                            )}
                        >
                            Dialogue Tier
                        </span>
                    </label>
                    <TierDescription
                        isAvailable={dialogueAvailable}
                        title={DIALOGUE_TIER_TITLE}
                        text={DIALOGUE_TIER_TEXT}
                        price={course.dialoguePrice}
                    />
                </div>
                {session && anyAvailable && (
                    <SubmitButton>Enroll!</SubmitButton>
                )}
            </form>
            {!session && anyAvailable && <SignInToBuyBtn />}
            <p className="text-center text-sm text-slate-500">
                7-Day Money-Back Guarantee
            </p>
            <Link
                href="/articles/terms-symposia"
                className="text-center text-sm text-slate-500 underline hover:text-slate-600 dark:hover:text-slate-300 transition duration-300"
            >
                Terms Apply
            </Link>
        </div>
    );
}

function TierDescription({
    title,
    text,
    price,
    isAvailable,
}: {
    isAvailable: boolean;
    title: string;
    text: string;
    price: number;
}) {
    return (
        <div className="flex flex-col max-w-xs items-center relative">
            {!isAvailable && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Cross lines */}
                    <div className="absolute w-[85%] h-0.5 bg-slate-200 dark:bg-slate-800/70 rotate-45"></div>

                    <div className="absolute w-[85%] h-0.5 bg-slate-200 dark:bg-slate-800/70  -rotate-45"></div>
                    <div className="z-19 absolute px-4 w-[100%] h-[25%] py-1 rounded bg-white dark:bg-neutral-950 blur-md"></div>
                    <span className="z-20 text-sm font-semibold tracking-wide  text-slate-600/50 dark:text-slate-800 px-2 py-1 rounded">
                        Currently unavailable
                    </span>
                </div>
            )}

            <p
                className={cn(
                    "text-5xl font-bold",
                    isAvailable ? "" : "text-slate-300/90 dark:text-gray-700"
                )}
            >
                <sup className="text-3xl font-extrabold">US</sup>${price / 100}
                <sup className="text-3xl font-semibold">00</sup>
            </p>
            <Heading
                as="h5"
                replacementClasses={cn(
                    isAvailable
                        ? "text-primary dark:text-acid-green"
                        : "text-slate-300 dark:text-gray-700"
                )}
            >
                {title}
            </Heading>
            <p
                className={cn(
                    "text-xs px-2",
                    isAvailable
                        ? " text-slate-600 dark:text-gray-300"
                        : "text-slate-300 dark:text-gray-700"
                )}
            >
                {text}
            </p>
        </div>
    );
}
