import Link from "next/link";
import { FadeIn } from "lib/components/animations/FadeIn";
import { Heading } from "lib/components/ui/Heading";
import { Paragraph } from "lib/components/ui/Paragraph";
import { CardFancy } from "lib/components/ui/CardFancy";
import { HeroBackground } from "./HeroBackground";
import { EncyclopaediaLanding } from "./EncyclopaediaLanding";
import { ScreenWrapper } from "lib/components/ui/ScreenWrapper";
import { Button, Typography } from "@mui/material";
import { InfoCard } from "./InfoCard";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { Reviews } from "./Reviews";
import { PolyRhythmicSpiral } from "lib/components/animations/PolyRhythmicSpiral";
import { BackgroundBoxes } from "lib/components/animations/BackgroundBoxes";
import { EmbedTeacherProfile } from "features/editor/components/EmbedTeacherProfile";
import { PointerHighlight } from "lib/components/ui/PointerHighlight";
import { LatestNewsCard } from "lib/email/templates/components/LatestNewsCard";
import { SubscribeToNewsletterForm } from "./SubscribeToNewsletter";
import { ValueProposition } from "./ValueProposition";

export function SPhilLanding() {
    return (
        <>
            <MainHero />

            <PageWrapper className="my-16 md:my-32 gap-16 md:gap-32">
                <OpeningDescription />
                <MainInfoCard />
                <InfoCards />
                <FollowerStudentHighlight />
                <Community />
                <NewsletterSignUp />
                <ValuePropositionWrapped />
                <SymposiaHero />
                <VisitCourses />
                <Instructors />
                <Refunds />
                <EncLanding />
            </PageWrapper>

            {/* <section className="h-full flex flex-col justify-front items-center container py-20">
                <MaintenanceStatic
                    severity="beta"
                    message="This is a very early release of sPhil and we are continuously working to improve it. If you encounter any issues or want to get involved, please visit our GitHub repository."
                />
            </section> */}
        </>
    );
}

function MainHero() {
    return (
        <>
            <ScreenWrapper className="relative flex flex-col items-center justify-start overflow-hidden">
                <HeroBackground />
                <div className="relative flex flex-col items-center justify-center z-2 py-28">
                    <FadeIn>
                        <Heading>Study The Great Texts</Heading>
                    </FadeIn>
                    <div className="flex justify-center gap-3">
                        <FadeIn delay={1.5}>
                            <Paragraph
                                style="grotesk"
                                className="md:!text-4xl !text-2xl m-0"
                                span
                            >
                                Examine closer.
                            </Paragraph>
                        </FadeIn>
                        <FadeIn delay={3.25}>
                            <Paragraph
                                style="grotesk"
                                className="md:!text-4xl !text-2xl m-0"
                                span
                            >
                                Comprehend truer.
                            </Paragraph>
                        </FadeIn>
                    </div>
                    <div className="mt-16 mb-24 flex justify-center items-center flex-wrap gap-16">
                        <FadeIn delay={0.25}>
                            <CardFancy
                                title={"COURSES"}
                                tagline={
                                    "Focused courses offering guidance and analysis of the great texts—their ideas, arguments, and enduring power."
                                }
                                href={"/courses"}
                                buttons={[
                                    {
                                        title: "View Courses",
                                        href: "/courses",
                                    },
                                ]}
                            />
                        </FadeIn>
                        <FadeIn delay={0.5}>
                            <CardFancy
                                title={"ENCYCLOPAEDIA"}
                                tagline={
                                    "Detailed articles examining the development, ideas and systems of the major texts."
                                }
                                href={"/articles/articles"}
                                buttons={[
                                    {
                                        title: "Overview",
                                        href: "/articles/articles",
                                    },
                                ]}
                            />
                        </FadeIn>
                    </div>
                </div>
            </ScreenWrapper>
            <div className="relative">
                <div className="absolute top-0 h-36 w-full -translate-y-full bg-linear-to-t from-[#fff6f6] to-transparent dark:from-[#10b981] pointer-events-none opacity-10" />
            </div>
        </>
    );
}

function OpeningDescription() {
    return (
        <FadeIn>
            <Heading as="h4" additionalClasses="max-w-xl">
                <span className="dark:text-acid-green text-[#6b0072]">
                    sPhil
                </span>{" "}
                is dedicated to the close, detailed study of the world&apos;s
                most foundational texts. Our courses guide you through the great
                works, fostering a profound, nuanced, and lasting understanding.
            </Heading>
        </FadeIn>
    );
}

function MainInfoCard() {
    const text = (
        <>
            We dream of a way of studying the great texts that is intense,
            life-long and free. To be able to rigorously engage with concepts
            and ideas to their utmost depth without sacrificing either scholarly
            quality or creativity. To be able to pursue and hone one&apos;s
            philosophical or literary craft and enjoyment in a way that supports
            and enriches everyday living. And finally to be thinking deeply
            about contents of art, religion and philosophy purely for their own
            sake. Our courses are intended to be guides along this path of
            study, inspiration and reflection. Whether you are a novice or a
            professional, we welcome anyone who has a burning desire to examine,
            philosophically, the wonders of being.
        </>
    );

    return (
        <FadeIn>
            <section className="md:px-10 max-w-[900px]">
                <InfoCard
                    headingSize="h3"
                    title="Why"
                    text={text}
                    imgUrl="/static/images/fire.webp"
                    maskType="triangle"
                />
            </section>
        </FadeIn>
    );
}

function FollowerStudentHighlight() {
    return (
        <FadeIn>
            <section className="mx-auto max-w-lg py-20 text-2xl font-bold tracking-tight md:text-4xl">
                Don&apos;t be a follower
                <PointerHighlight
                    rectangleClassName="bg-[#FAF] dark:bg-acid-green/20 border-neutral-300 dark:border-neutral-600"
                    pointerClassName="text-yellow-500"
                >
                    <span className="relative z-10">be a student.</span>
                </PointerHighlight>
                <Typography className="!mt-12 text-slate-700 dark:text-slate-300 pt-4 text-justify sm:text-lg">
                    We foster a culture of disciplined inquiry and love for the
                    truth: students interrogate arguments and sources, analyze
                    evidence, and make up their own minds—never accepting claims
                    or conventions at face value. The authors of great works
                    were first great students.
                </Typography>
            </section>
        </FadeIn>
    );
}

function InfoCards() {
    return (
        <FadeIn>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                <InfoCard
                    title="Deepen Your Thinking: Explore The Great Texts In-Depth"
                    text="Dive into the world's greatest ideas with our comprehensive online courses. Go beyond introductory lectures and engage with challenging concepts in a supportive learning environment."
                    maskType="diamond"
                    imgUrl="/static/images/sun.webp"
                />
                <InfoCard
                    title="Choose Your Learning Style: Digital, with Seminars, or 1-on-1 Dialogue"
                    text="We offer a variety of learning formats to suit your ambition. Take courses entirely on-demand with digital content at your own pace, participate in live interactive seminars with fellow peers, or get personalized guidance with private sessions from our instructors."
                    maskType="diamond"
                    imgUrl="/static/images/discussion.webp"
                />
                <InfoCard
                    title="Focus on Text: Meet the Greatest Minds of History"
                    text="Gain insights from renowned philosophers, poets and authors by meeting them on their own ground, namely, their text! Our courses center around primary texts supplemented by secondary literature. We think it is important that you spend time with the authors's own text and become equipped to make up your own mind regarding their art or ideas."
                    maskType="diamond"
                    imgUrl="/static/images/books.webp"
                />
                <InfoCard
                    title="The Great Conversation: Critical Thinking Through Classic Texts"
                    text="They who do not understand the past cannot comprehend the future. Philosophy, poetry, plays, and historical texts form a great conversation, which is the ultimate discovery of futures. Learn to think critically, analyze enduring arguments from Plato to Milton, and form your own well-reasoned opinions—skills invaluable in all aspects of life."
                    maskType="diamond"
                    imgUrl="/static/images/eye.webp"
                />
            </section>
        </FadeIn>
    );
}

function ValuePropositionWrapped() {
    return (
        <>
            <section>
                <Heading as="h3" additionalClasses="max-w-lg">
                    Learn about our{" "}
                    <span className="dark:text-acid-green text-[#6b0072]">
                        value proposition
                    </span>
                </Heading>
                <p className="text-lg text-slate-500 dark:text-slate-300 py-2 text-center">
                    Hover or click on the images below to learn more{" "}
                </p>
            </section>
            <ValueProposition />
        </>
    );
}

function Community() {
    return (
        <section className="flex flex-col items-center relative">
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none overflow-hidden"
            >
                <div
                    className="absolute -left-32 top-0 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "4s" }}
                />

                <div
                    className="absolute -right-32 bottom-0 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "5s" }}
                />

                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "6s" }}
                />
            </div>
            <Heading as="h3" additionalClasses="max-w-lg">
                Join the{" "}
                <span className="dark:text-acid-green text-[#6b0072]">
                    community
                </span>
            </Heading>
            <p className="text-lg text-slate-500 dark:text-slate-300 py-2">
                What do our students say about our courses and instructors?
            </p>
            <Reviews />
        </section>
    );
}

function NewsletterSignUp() {
    return (
        <section>
            <Heading as="h3" additionalClasses="max-w-lg">
                Stay up-to-date with our{" "}
                <span className="dark:text-acid-green text-[#6b0072]">
                    newsletter
                </span>
            </Heading>
            <p className="text-lg text-slate-500 dark:text-slate-300 py-2">
                Sign up to receive updates on new courses, seminars, and other
                events.
            </p>
            <SubscribeToNewsletterForm />
            <div className="mt-6">
                <LatestNewsCard />
            </div>
        </section>
    );
}

function SymposiaHero() {
    return (
        <div className="h-[45rem] -my-36 md:my-6 w-full  flex flex-col items-center justify-center overflow-hidden rounded-md ">
            <div className="absolute overflow-hidden -translate-y-5">
                <FadeIn>
                    <PolyRhythmicSpiral />
                </FadeIn>
            </div>
            <div className="-translate-y-[29px] sm:translate-y-[8px] md:-translate-y-[1px] lg:-translate-y-3 flex flex-col items-center justify-center">
                <div className="font-bold text-center relative z-20 bg-clip-text tracking-widest text-transparent">
                    <Heading replacementClasses="pb-4 text-transparent bg-linear-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA] max-w-[300px] sm:max-w-none">
                        Discover & Reflect
                    </Heading>
                </div>
                <h3 className="text-xl my-1.5 md:text-2xl lg:text-3xl text-stone-600 dark:text-stone-300/90 font-light inter-var text-center max-w-[250px] sm:max-w-none">
                    Truth hides in the text. We teach you how to see it.
                </h3>
                <div className="w-[40rem] h-40 relative">
                    {/* Gradients */}
                    <div className="absolute inset-x-20 top-0 bg-linear-to-r from-transparent via-purple-400 to-transparent h-[2px] w-3/4 blur-xs" />
                    <div className="absolute inset-x-20 top-0 bg-linear-to-r from-transparent via-purple-400 to-transparent h-px w-3/4" />
                    <div className="absolute inset-x-60 top-0 bg-linear-to-r from-transparent via-pink-400 to-transparent h-[5px] w-1/4 blur-xs" />
                    <div className="absolute inset-x-60 top-0 bg-linear-to-r from-transparent via-pink-400 to-transparent h-px w-1/4" />
                </div>
            </div>
        </div>
    );
}

function VisitCourses() {
    return (
        <section className="flex flex-col items-center relative">
            <div
                aria-hidden="true"
                className="absolute inset-48 grid grid-cols-4 -space-x-2 sm:-space-x-24 md:-space-x-52 opacity-40 dark:opacity-20"
            >
                <div className="blur-[106px] col-span-1 h-64 bg-linear-to-br from-purple-700 to-purple-400 dark:from-blue-700" />
                <div className="blur-[106px] col-span-1 col-start-4 h-32 bg-linear-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
            </div>
            <Heading as="h3" additionalClasses="max-w-xl">
                Look through the eyes of{" "}
                <span className="dark:text-acid-green text-[#6b0072]">
                    millennia
                </span>
            </Heading>
            <p className="text-lg text-slate-500 dark:text-slate-300 py-4">
                Engage in discourses that stretch across empires, generations,
                and time.
            </p>
            <Link href="/courses">
                <Button variant="contained">See our courses</Button>
            </Link>
        </section>
    );
}

function Instructors() {
    return (
        <section className="flex flex-col items-center">
            <Heading as="h3" additionalClasses="max-w-lg">
                Meet the{" "}
                <span className="dark:text-acid-green text-[#6b0072]s">
                    instructors
                </span>
            </Heading>
            <p className="text-lg text-slate-500 dark:text-slate-300 py-2">
                Here you can find brief information about our teacher&apos;s
                interests and qualifications.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                <EmbedTeacherProfile
                    infoCard
                    teacherInput="filip:Filip Niklas, PhD"
                    altText
                />
                <EmbedTeacherProfile
                    infoCard
                    teacherInput="ahilleas:Ahilleas Rokni, PhD"
                    altText
                />
                <EmbedTeacherProfile
                    infoCard
                    teacherInput="christopher:Christopher Satoor, PhD Candidate"
                    altText
                />
            </div>
        </section>
    );
}

function EncLanding() {
    return (
        <section className="relative flex justify-center h-[150vh] sm:h-[120vh] md:h-[100vh] w-[90vw] overflow-hidden">
            <BackgroundBoxes />

            <div className="max-w-2xl relative">
                <FadeIn>
                    <EncyclopaediaLanding />
                </FadeIn>
            </div>
        </section>
    );
}

function Refunds() {
    return (
        <section className="flex flex-col items-center">
            <Heading as="h3" additionalClasses="max-w-xl">
                Tried it, not for you,{" "}
                <span className="dark:text-acid-green text-[#6b0072]">
                    changed
                </span>{" "}
                your mind?
            </Heading>
            <p className="text-lg text-slate-500 dark:text-slate-300 py-4">
                If you find that a particular course was not for you, we offer
                full refunds up until 7-days after purchase.
            </p>
        </section>
    );
}
