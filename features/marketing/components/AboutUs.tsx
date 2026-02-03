import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "lib/components/animations/FadeIn";
import { Heading } from "lib/components/ui/Heading";
import { Paragraph } from "lib/components/ui/Paragraph";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { ScreenWrapper } from "lib/components/ui/ScreenWrapper";
import { EmbedTeacherProfile } from "features/editor/components/EmbedTeacherProfile";
import { Button, Typography } from "@mui/material";

export function AboutUs() {
    return (
        <>
            <HeroSection />
            <PageWrapper className="my-16 md:my-32 gap-16 md:gap-32">
                <MeetTheFounders />
                <OurStory />
                <OurMission />
                <WhyWeArePassionate />
                <OurPhilosophy />
                <JoinUs />
            </PageWrapper>
        </>
    );
}

function HeroSection() {
    return (
        <ScreenWrapper className="relative flex flex-col items-center justify-center min-h-[60vh]">
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none overflow-hidden"
            >
                <div
                    className="absolute -left-32 top-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "6s" }}
                />
                <div
                    className="absolute -right-32 bottom-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "8s" }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"
                    style={{ animationDuration: "10s" }}
                />
            </div>
            <div className="relative z-10 flex flex-col items-center px-4">
                <FadeIn>
                    <Heading>About Us</Heading>
                </FadeIn>
                <FadeIn delay={0.5}>
                    <Paragraph
                        style="grotesk"
                        className="md:!text-2xl !text-xl m-0 mt-6 max-w-2xl text-center"
                    >
                        Scholars united by a love for the great texts and a
                        commitment to making transformative philosophy and
                        literature accessible to all.
                    </Paragraph>
                </FadeIn>
            </div>
        </ScreenWrapper>
    );
}

function OurStory() {
    return (
        <FadeIn>
            <section className="max-w-4xl">
                <Heading as="h3" additionalClasses="max-w-lg mx-auto">
                    Our{" "}
                    <span className="dark:text-acid-green text-[#6b0072]">
                        Story
                    </span>
                </Heading>
                <Typography className="!mt-8 text-slate-700 dark:text-slate-300 text-justify sm:text-lg leading-relaxed">
                    sPhil was born from a shared frustration and a shared dream.
                    As doctoral students at the University of Warwick, our
                    founders experienced firsthand the transformative power of
                    engaging deeply with the great philosophical texts. Yet they
                    also witnessed how inaccessible this experience remained for
                    most people—locked behind academic walls, fragmented into
                    shallow introductions, or lost in jargon-heavy scholarship
                    that spoke only to specialists.
                </Typography>
                <Typography className="!mt-6 text-slate-700 dark:text-slate-300 text-justify sm:text-lg leading-relaxed">
                    We asked ourselves: What if rigorous philosophical education
                    could be both profound and accessible? What if anyone with
                    the desire to understand could sit with Plato, wrestle with
                    Hegel, or contemplate Milton—not as passive consumers of
                    summaries, or predictably prefabricated AI output, but as
                    genuine students engaging with the texts themselves?
                </Typography>
                <Typography className="!mt-6 text-slate-700 dark:text-slate-300 text-justify sm:text-lg leading-relaxed">
                    sPhil is our answer to that question.
                </Typography>
            </section>
        </FadeIn>
    );
}

function OurMission() {
    return (
        <FadeIn>
            <section className="w-full max-w-5xl">
                <div className="relative">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 dark:from-purple-500/20 dark:to-emerald-500/20 rounded-3xl blur-xl"
                    />
                    <div className="relative border border-slate-200 dark:border-slate-700 rounded-3xl p-8 md:p-12 lg:p-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center text-center">
                            <span className="text-xs md:text-sm font-semibold tracking-[0.3em] uppercase text-purple-600 dark:text-acid-green mb-6">
                                Our Mission
                            </span>
                            <div className="relative mb-8">
                                <Image
                                    src="/static/images/fire.webp"
                                    alt="Guiding flame"
                                    width={80}
                                    height={80}
                                    className="opacity-90"
                                />
                            </div>
                            <blockquote className="max-w-3xl">
                                <Typography className="!text-xl md:!text-2xl lg:!text-3xl !font-light !leading-relaxed text-slate-700 dark:text-slate-200 italic">
                                    "We exist to guide serious students through
                                    the world's most important philosophical and
                                    literary works."
                                </Typography>
                            </blockquote>
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-400 dark:via-slate-500 to-transparent my-8" />
                            <Typography className="max-w-2xl text-slate-600 dark:text-slate-300 sm:text-lg leading-relaxed">
                                Our courses are not summaries or
                                simplifications—they are invitations to think
                                alongside the greatest minds in history. We
                                believe that understanding comes not from being
                                told what to think, but from learning how to
                                read, question, and reflect for oneself. Our
                                mission is to equip you with the tools, context,
                                and guidance you need to make these texts your
                                own.
                            </Typography>
                        </div>
                    </div>
                </div>
            </section>
        </FadeIn>
    );
}

function WhyWeArePassionate() {
    const passionItems = [
        {
            number: "1",
            title: "Philosophy and Literature Changes Lives",
            text: "We have seen it happen—in ourselves and in our students. The moment when a difficult passage suddenly makes sense, when an ancient argument illuminates a contemporary problem, when reading transforms into genuine understanding. Philosophy is not merely an academic subject, nor is literature mere enjoyment; they are practices that shapes how we think, live, and relate to the world.",
        },
        {
            number: "2",
            title: "The Texts Deserve Better",
            text: "Too often, the great works are reduced to bullet points, oversimplified for mass consumption, or approached with a superficiality that betrays their depth. These texts have endured for centuries because they contain insights that reward careful, repeated study. We are passionate about honoring that legacy by teaching them with the seriousness they deserve.",
        },
        {
            number: "3",
            title: "Everyone Deserves Access",
            text: "Philosophical and literary education should not be a privilege reserved for those who can attend elite universities. The questions that Plato asked, the beauty that Milton forged, the arguments that Hegel sought to craft—these belong to everyone who cares enough to delve deeper. We are passionate about creating pathways into this tradition for anyone willing to do the work.",
        },
        {
            number: "4",
            title: "Thinking Matters Now More Than Ever",
            text: "In an age of information overload and shallow discourse, the skills cultivated by serious philosophical study—careful reading, rigorous analysis, nuanced argument, intellectual humility—are more valuable than ever. We are passionate about equipping our students not just with knowledge, but with the capacity to think clearly and independently.",
        },
    ];

    return (
        <section className="w-full max-w-5xl">
            <FadeIn>
                <Heading as="h3" additionalClasses="max-w-xl mx-auto mb-16">
                    Why We Are{" "}
                    <span className="dark:text-acid-green text-[#6b0072]">
                        Passionate
                    </span>
                </Heading>
            </FadeIn>
            <div className="space-y-12 md:space-y-0">
                {passionItems.map((item, index) => (
                    <FadeIn key={item.number} delay={index * 0.15}>
                        <div
                            className={`flex flex-col md:flex-row items-start gap-6 md:gap-12 py-8 md:py-12 ${
                                index % 2 === 1 ? "md:flex-row-reverse" : ""
                            }`}
                        >
                            <div
                                className={`flex-shrink-0 ${
                                    index % 2 === 1
                                        ? "md:text-right"
                                        : "md:text-left"
                                }`}
                            >
                                <span className="text-7xl md:text-8xl lg:text-9xl font-black text-slate-100 dark:text-slate-800 select-none leading-none">
                                    {item.number}
                                </span>
                            </div>
                            <div
                                className={`flex-1 ${
                                    index % 2 === 1
                                        ? "md:text-right"
                                        : "md:text-left"
                                }`}
                            >
                                <h4 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                                    {item.title}
                                </h4>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed sm:text-lg">
                                    {item.text}
                                </p>
                            </div>
                        </div>
                        {index < passionItems.length - 1 && (
                            <div className="hidden md:block w-full h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent" />
                        )}
                    </FadeIn>
                ))}
            </div>
        </section>
    );
}

function MeetTheFounders() {
    return (
        <section className="flex flex-col items-center w-full">
            <FadeIn>
                <div className="flex justify-center">
                    <Heading as="h3" additionalClasses="max-w-lg">
                        Meet the{" "}
                        <span className="dark:text-acid-green text-[#6b0072]">
                            Team
                        </span>
                    </Heading>
                </div>
                <p className="text-lg text-slate-500 dark:text-slate-300 py-2 text-center max-w-2xl">
                    Our instructors are scholars who have dedicated their lives
                    to the study and teaching of philosophy. Each brings years
                    of research, teaching experience, and genuine passion for
                    helping others discover the transformative power of the
                    great texts.
                </p>
            </FadeIn>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mt-8">
                <FadeIn delay={0.1}>
                    <EmbedTeacherProfile
                        infoCard
                        teacherInput="filip:Filip Niklas, PhD — Co-Founder & Tech Lead"
                        altText
                    />
                </FadeIn>
                <FadeIn delay={0.2}>
                    <EmbedTeacherProfile
                        infoCard
                        teacherInput="ahilleas:Ahilleas Rokni, PhD — Co-Founder & Business Lead"
                        altText
                    />
                </FadeIn>
                <FadeIn delay={0.3}>
                    <EmbedTeacherProfile
                        infoCard
                        teacherInput="christopher:Christopher Satoor, PhD Candidate — Instructor"
                        altText
                    />
                </FadeIn>
            </div>
        </section>
    );
}

function OurPhilosophy() {
    return (
        <FadeIn>
            <section className="max-w-4xl">
                <Heading as="h3" additionalClasses="max-w-lg mx-auto">
                    Our{" "}
                    <span className="dark:text-acid-green text-[#6b0072]">
                        Philosophy
                    </span>{" "}
                    of Teaching
                </Heading>
                <div className="mt-8 space-y-6">
                    <div className="border-l-4 border-purple-500 dark:border-acid-green pl-6">
                        <Typography
                            variant="h6"
                            className="!font-semibold !mb-2"
                        >
                            Text First
                        </Typography>
                        <Typography className="text-slate-700 dark:text-slate-300 sm:text-lg">
                            We center our teaching on primary sources. Secondary
                            literature illuminates, but it can never replace the
                            experience of grappling with an author's own words.
                        </Typography>
                    </div>
                    <div className="border-l-4 border-purple-500 dark:border-acid-green pl-6">
                        <Typography
                            variant="h6"
                            className="!font-semibold !mb-2"
                        >
                            Depth Over Breadth
                        </Typography>
                        <Typography className="text-slate-700 dark:text-slate-300 sm:text-lg">
                            We would rather you understand one text or argument
                            deeply than skim across a dozen superficially. True
                            comprehension takes time, and we design our courses
                            to give you that time.
                        </Typography>
                    </div>
                    <div className="border-l-4 border-purple-500 dark:border-acid-green pl-6">
                        <Typography
                            variant="h6"
                            className="!font-semibold !mb-2"
                        >
                            Active Engagement
                        </Typography>
                        <Typography className="text-slate-700 dark:text-slate-300 sm:text-lg">
                            Philosophy and literature is not a spectator sport.
                            Our courses challenge you to read carefully, think
                            critically, and form your own interpretations—not
                            simply to absorb information passively.
                        </Typography>
                    </div>
                    <div className="border-l-4 border-purple-500 dark:border-acid-green pl-6">
                        <Typography
                            variant="h6"
                            className="!font-semibold !mb-2"
                        >
                            Scholarly Rigor, Accessible Language
                        </Typography>
                        <Typography className="text-slate-700 dark:text-slate-300 sm:text-lg">
                            We maintain the highest scholarly standards while
                            striving to communicate in clear, accessible
                            language. Complexity should arise from the ideas
                            themselves, not from unnecessary obscurity in their
                            presentation.
                        </Typography>
                    </div>
                    <div className="border-l-4 border-purple-500 dark:border-acid-green pl-6">
                        <Typography
                            variant="h6"
                            className="!font-semibold !mb-2"
                        >
                            Lifelong Learning
                        </Typography>
                        <Typography className="text-slate-700 dark:text-slate-300 sm:text-lg">
                            The study of philosophy is never complete. We see
                            ourselves as companions on a journey that extends
                            beyond any single course—partners in a lifelong
                            pursuit of wisdom.
                        </Typography>
                    </div>
                </div>
            </section>
        </FadeIn>
    );
}

function JoinUs() {
    return (
        <FadeIn>
            <section className="flex flex-col items-center text-center max-w-2xl">
                <Heading as="h3" additionalClasses="max-w-xl">
                    Begin Your{" "}
                    <span className="dark:text-acid-green text-[#6b0072]">
                        Journey
                    </span>
                </Heading>
                <Typography className="!mt-6 text-slate-700 dark:text-slate-300 sm:text-lg">
                    Whether you are taking your first steps into philosophy or
                    returning after years away, whether you seek intellectual
                    enrichment or professional development, we invite you to
                    join us. The great texts await, and we are here to guide you
                    through them.
                </Typography>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <Link href="/courses">
                        <Button variant="contained" size="large">
                            Explore Our Courses
                        </Button>
                    </Link>
                    <Link href="/articles/articles">
                        <Button variant="outlined" size="large">
                            Read the Encyclopaedia
                        </Button>
                    </Link>
                </div>
            </section>
        </FadeIn>
    );
}
