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

type CourseEnrollButtonProps = {
    slug: string;
};

const BASE_TIER_TITLE = "Solo Learner";
const BASE_TIER_TEXT =
    "Base tier grants access to the course and all its digital contents, including any future updates.";
const SEMINAR_TIER_TITLE = "Peer";
const SEMINAR_TIER_TEXT =
    "Seminar tier includes base tier as well as one-time access to live seminars, valid only for the season in which your course is held.";
const DIALOGUE_TIER_TITLE = "Scholar";
const DIALOGUE_TIER_TEXT =
    "Dialogue tier includes base and seminar tier as well as weekly 1:1 sessions with the teacher, valid only for the season in which your course is held. Limited slots.";

export async function CourseEnroll({ slug }: CourseEnrollButtonProps) {
    const course = await dbGetCourseBySlug(slug);
    if (!course) {
        return <div className="d-badge d-badge-error">n/a</div>;
    }
    const baseAvailable = course.baseAvailability! > new Date();
    const seminarAvailable = course.seminarAvailability > new Date();
    const dialogueAvailable = course.dialogueAvailability > new Date();
    const anyAvailable = baseAvailable || seminarAvailable || dialogueAvailable;

    const session = await auth();

    if (session) {
        const userCourses = await dbGetUserPurchasedCourses(session.user.id);
        if (
            !!userCourses &&
            userCourses.find((course) => course.slug === slug)
        ) {
            return <div className="d-badge d-badge-success">Owned</div>;
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
        <div className="border w-[320px] flex flex-col justify-center items-center p-3 gap-2">
            <form
                action={handleEnroll}
                className="flex flex-col gap-2 justify-center  grow"
            >
                <p className="text-slate-800 dark:text-gray-300 font-bold">
                    Select your course tier
                </p>

                <div className="form-control has-checked:bg-indigo-50 has-checked:dark:bg-green-700/20 rounded-md relative">
                    {!baseAvailable && (
                        <span className="absolute text-xs text-slate-500  top-0 right-0">
                            &nbsp;Currently unavailable
                        </span>
                    )}
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
                            className={`d-label-text dark:text-gray-300 ${
                                !baseAvailable && "line-through"
                            }`}
                        >
                            Base Tier
                        </span>
                    </label>
                    <TierDescription
                        title={BASE_TIER_TITLE}
                        text={BASE_TIER_TEXT}
                        price={course.basePrice}
                    />
                </div>
                <div className="form-control has-checked:bg-indigo-50 has-checked:dark:bg-green-700/20 rounded-md relative">
                    {!seminarAvailable && (
                        <span className="absolute text-xs text-slate-500 top-0 right-0">
                            &nbsp;Currently unavailable
                        </span>
                    )}
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
                            className={`d-label-text dark:text-gray-300 ${
                                !seminarAvailable && "line-through"
                            }`}
                        >
                            Seminar Tier
                        </span>
                    </label>
                    <TierDescription
                        title={SEMINAR_TIER_TITLE}
                        text={SEMINAR_TIER_TEXT}
                        price={course.seminarPrice}
                    />
                </div>
                <div className="form-control has-checked:bg-indigo-50 has-checked:dark:bg-green-700/20 rounded-md relative">
                    {!dialogueAvailable && (
                        <span className="absolute text-xs text-slate-500 top-0 right-0">
                            &nbsp;Currently unavailable
                        </span>
                    )}
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
                            className={`d-label-text dark:text-gray-300 ${
                                !dialogueAvailable && "line-through"
                            }`}
                        >
                            Dialogue Tier
                        </span>
                    </label>
                    <TierDescription
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
                30-Day Money-Back Guarantee
            </p>
        </div>
    );
}

function TierDescription({
    title,
    text,
    price,
}: {
    title: string;
    text: string;
    price: number;
}) {
    return (
        <div className="flex flex-col max-w-xs items-center">
            <p className="text-5xl font-bold">
                <sup className="text-3xl font-extrabold">US</sup>${price / 100}
                <sup className="text-3xl font-semibold">00</sup>
            </p>
            <Heading
                as="h4"
                replacementClasses="text-primary dark:text-acid-green"
            >
                {title}
            </Heading>
            <p className="text-xs text-slate-600 dark:text-gray-300 px-2">
                {text}
            </p>
        </div>
    );
}
