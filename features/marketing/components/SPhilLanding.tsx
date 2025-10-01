import Link from "next/link";
import { FadeIn } from "lib/components/animations/FadeIn";
import { Heading } from "lib/components/ui/Heading";
import { Paragraph } from "lib/components/ui/Paragraph";
import { CardFancy } from "lib/components/ui/CardFancy";
import { HeroBackground } from "./HeroBackground";
import { EncyclopaediaLanding } from "./EncyclopaediaLanding";
import { ScreenWrapper } from "lib/components/ui/ScreenWrapper";
import { Button } from "@mui/material";
import { InfoCard } from "./InfoCard";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { Reviews } from "./Reviews";
import { SubscribeToNewsletter } from "./SubscribeToNewsletter";
import { PolyRhythmicSpiral } from "lib/components/animations/PolyRhythmicSpiral";

export function SPhilLanding() {
    return (
        <>
            <MainHero />

            <PageWrapper className="mt-16 md:mt-32 gap-16 md:gap-32">
                <OpeningDescription />
                <MainInfoCard />
                <InfoCards />
                <Community />
                <NewsletterSignUp />
                <SymposiaHero />
                <VisitCourses />
                <Instructors />
                <Refunds />
            </PageWrapper>

            <section className="relative flex justify-center">
                <div className="max-w-2xl">
                    <FadeIn>
                        <EncyclopaediaLanding />
                    </FadeIn>
                </div>
            </section>

            <section className="relative flex flex-col items-center justify-start w-full h-full">
                <div className="py-20 flex flex-col items-center justify-center">
                    <FadeIn>
                        <Heading>What is sPhil?</Heading>
                    </FadeIn>
                    <div className="flex flex-col items-center">
                        <div
                            aria-hidden="true"
                            className="absolute inset-48 grid grid-cols-4 -space-x-2 sm:-space-x-24 md:-space-x-52 opacity-40 dark:opacity-20"
                        >
                            <div className="blur-[106px] col-span-1 h-64 bg-linear-to-br from-purple-700 to-purple-400 dark:from-blue-700" />
                            <div className="blur-[106px] col-span-1 col-start-4 h-32 bg-linear-to-r from-cyan-400 to-sky-300 dark:to-indigo-600" />
                        </div>

                        <FadeIn className="flex flex-col items-center gap-6 max-w-2xl">
                            <Paragraph>
                                Introducing the platform where the realms of
                                philosophy and software converge seamlessly.
                            </Paragraph>
                            <Paragraph>
                                At our platform, we&apos;ve reimagined the way
                                philosophy is explored and shared in the digital
                                age. We&apos;ve harnessed the power of the
                                world&apos;s leading collaborative development
                                platform to create a dynamic and ever-evolving
                                space where code and content continuously
                                overlap.
                            </Paragraph>
                            <Paragraph>
                                Here, philosophy isn&apos;t confined to static
                                texts or stagnant discussions. Instead,
                                it&apos;s a living, breathing entity that
                                evolves alongside the rapid advancements in the
                                digital world. Our GitHub repository serves as
                                the epicenter of this synergy, where
                                philosophers, thinkers, and developers unite to
                                explore, dissect, and refine philosophical ideas
                                in real-time.
                            </Paragraph>
                            <Paragraph>
                                Our commitment to software principles ensures
                                that the philosophy presented on our website is
                                not only rigorous and thought-provoking but also
                                highly accessible and user-friendly. We embrace
                                open-source principles, inviting contributions
                                from anyone who wishes to join the conversation,
                                whether they&apos;re an established philosopher
                                or a coding enthusiast with a passion for
                                philosophy.
                            </Paragraph>
                            <Paragraph>
                                Through version control, continuous integration,
                                and collaborative coding practices, we&apos;ve
                                created a digital philosophy ecosystem that
                                adapts and grows organically. This approach
                                ensures that our content remains relevant,
                                accurate, and engaging, reflecting the
                                ever-evolving landscape of philosophical
                                thought.
                            </Paragraph>
                            <Paragraph>
                                Join us on this exhilarating journey where
                                philosophy and code converge, fostering an
                                environment where the pursuit of knowledge is as
                                dynamic and interconnected as the world itself.
                                Welcome to the future of philosophical
                                exploration, where ideas and software unite to
                                open the horizons of intellectual discourse.
                            </Paragraph>
                        </FadeIn>

                        <FadeIn className="mt-6">
                            <Link href="/articles/contributing">
                                <Button variant="contained">
                                    How to contribute
                                </Button>
                            </Link>
                        </FadeIn>
                    </div>
                </div>
            </section>

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
                    <FadeIn delay={0.1}>
                        <Paragraph
                            style="grotesk"
                            className="md:!text-4xl !text-2xl"
                        >
                            Examine closer. Comprehend truer.
                        </Paragraph>
                    </FadeIn>
                    <FadeIn
                        delay={0.25}
                        className="mt-16 mb-24 flex justify-center items-center flex-wrap gap-16"
                    >
                        <CardFancy
                            title={"COURSES"}
                            tagline={
                                "Focused courses providing guidance and analysis of the great texts and their core arguments."
                            }
                            href={"/symposia/courses"}
                            buttons={[
                                {
                                    title: "View Courses",
                                    href: "/symposia/courses",
                                },
                            ]}
                        />
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
    return (
        <FadeIn>
            <section className="md:px-10 max-w-[900px]">
                <InfoCard
                    headingSize="h3"
                    title="Why"
                    text="We dream of a way of studying the great works that is intense, life-long and free. To be able to rigorously engage with concepts and ideas to their utmost depth without sacrificing either scholarly quality or creativity. To be able to pursue and hone one's philosophical or literary craft and enjoyment in a way that supports and enriches everyday living. And finally to be thinking deeply about contents of art, religion and philosophy purely for their own sake. Our courses are intended to be guides along this path of study and reflection. Whether you are a novice or a professional, we welcome anyone who has a burning desire to examine, philosophically, the wonders of being."
                    imgUrl="/static/images/fire.webp"
                    maskType="triangle"
                />
            </section>
        </FadeIn>
    );
}

function InfoCards() {
    return (
        <FadeIn>
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                <InfoCard
                    title="Deepen Your Thinking: Explore Philosophy In-Depth"
                    text="Dive into the world's greatest ideas with our comprehensive online philosophy courses. Go beyond introductory lectures and engage with challenging concepts in a supportive learning environment."
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
                    text="Gain insights from renowned philosophers by meeting them on their own ground, namely, their text! Our courses center around primary texts supplemented by secondary literature. We think it is important that you spend time with the philosopher's own text and become equipped to make up your own mind regarding their ideas."
                    maskType="diamond"
                    imgUrl="/static/images/books.webp"
                />
                <InfoCard
                    title="Sharpen Your Critical Thinking: Unleash Your Philosophical Potential"
                    text="They who do not understand the past cannot comprehend the future. Philosophy is not about the past but the discovery of futures. Learn to think critically, analyze arguments, and form your own well-reasoned opinions - skills valuable in all aspects of life."
                    maskType="diamond"
                    imgUrl="/static/images/eye.webp"
                />
            </section>
        </FadeIn>
    );
}

function Community() {
    return (
        <section className="flex flex-col items-center">
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
            <SubscribeToNewsletter />
        </section>
    );
}

function SymposiaHero() {
    // TODO keep here or move elsewhere?
    // FIXME small sized UI error with the centered line
    return (
        <div className="h-[45rem] -my-36 md:my-6 w-full  flex flex-col items-center justify-center overflow-hidden rounded-md ">
            <div className="absolute overflow-hidden -translate-y-5">
                <FadeIn>
                    <PolyRhythmicSpiral />
                </FadeIn>
            </div>
            <div className="translate-y-[7px] md:-translate-y-[2px] lg:-translate-y-3 flex flex-col items-center justify-center">
                <div className="font-bold text-center relative z-20 bg-clip-text tracking-widest text-transparent">
                    <Heading replacementClasses="pb-4 text-transparent bg-linear-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA] max-w-[300px] sm:max-w-none">
                        Discover & Reflect
                    </Heading>
                </div>
                <h3 className="text-xl my-1.5 md:text-2xl lg:text-3xl text-stone-600 dark:text-stone-300/90 font-light inter-var text-center max-w-[250px] sm:max-w-none">
                    In-depth learning courses on philosophy
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
        <section className="flex flex-col items-center">
            <Heading as="h3" additionalClasses="max-w-xl">
                Look through the eyes of{" "}
                <span className="dark:text-acid-green text-[#6b0072]">
                    millennia
                </span>
            </Heading>
            <p className="text-lg text-slate-500 dark:text-slate-300 py-4">
                Discover and partake in philosophical discourses that stretches
                beyond empires, generations and time.
            </p>
            <Link href="/symposia/courses">
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
                <InfoCard
                    title="Filip Niklas, PhD"
                    text="Filip completed his PhD in philosophy in 2022 under the supervision of Professor Stephen Houlgate at the University of Warwick. The title of his thesis was Hegel's Critique of Determinism: Justifying Unfreedom as a Moment of Freedom. Filip has given papers and organized numerous conferences on philosophy. He has taught extensively both at university, at the Halkyon Academy and privately. Filip's main research areas are systematic philosophy, metaphysics, ontology, essence, freedom, determinism, and maintains an otherwise broad interest in all the dimensions of intelligence and reason. Filip is also an incurable fan of the art and poetry of William Blake."
                    maskType="squircle"
                    imgUrl="/static/images/people/filip.jpg"
                />
                <InfoCard
                    title="Ahilleas Rokni, PhD"
                    text="Ahilleas Rokni completed his PhD thesis in philosophy in 2022 under the supervision of Professor Stephen Houlgate at the University of Warwick. His thesis aimed to give an account of the much-debated move from the Science of Logic to the Philosophy of Nature in Hegel's system. Ahilleas's main research concerns are Hegel's logic, philosophy of nature, philosophy of science, and aesthetics."
                    maskType="squircle"
                    imgUrl="/static/images/people/ahilleas.jpg"
                />
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
