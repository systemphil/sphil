import { FocusCards } from "lib/components/ui/FocusCards";

export function ValueProposition() {
    const cards = [
        {
            title: (
                <>
                    Our courses provide a <b>structured</b>, step-by-step
                    curriculum designed for <b>mastery</b>, not just exposure.
                    This saves you dozens of hours of searching and vetting
                    content. We offer a curated, guided tour through the text,
                    not a mere survey or haphazard selection.
                </>
            ),
            alt: "structure",
            src: "/static/images/path.jpg",
        },
        {
            title: (
                <>
                    <b>
                        Two things you can never get back: time and certainty.
                    </b>{" "}
                    Our instructors are experts in the subject and will bring
                    you up to speed on the complex concepts and cut through the
                    myriad of interpretations. We guarantee a vetted quality to
                    our courses.
                </>
            ),
            alt: "time and certainty",
            src: "/static/images/lighthouse.jpg",
        },
        {
            title: (
                <>
                    In our seminars, the offer goes beyond mere information: we
                    provide <b>access and accountability</b>. Weekly live
                    interaction and commitment of the cohort cannot be
                    replicated by pre-recorded videos. You engage with other
                    passionate and curious people and together embark on a
                    transformative intellectual journey.
                </>
            ),
            alt: "access and accountability",
            src: "/static/images/rowing.jpg",
        },
        {
            title: (
                <>
                    For truly serious students, we offer tailored guidance and
                    direct feedback. Skip months of frustration with
                    personalized sessions that craft the content to your
                    research needs and specific intellectual hurdles. Just like
                    in the gym, a personal trainer can sharpen your mind and
                    focus on the pain points.
                </>
            ),
            alt: "personalized transformation",
            src: "/static/images/camp-fire.jpg",
        },
        {
            title: (
                <>
                    Free content is fragmented if not contradictory, which may
                    spark your curiosity but does not develop it. We provide the
                    coherence and continuity necessary for true philosophical
                    cultivation and understanding, ensuring every lecture builds
                    upon the last. Stop collecting pieces;{" "}
                    <b>start building your system</b>.
                </>
            ),
            alt: "build your system",
            src: "/static/images/construction.jpg",
        },
        {
            title: (
                <>
                    When you join our live seminars, you're not just getting
                    access to the instructor; you're joining a dedicated cohort
                    of serious students, academics, and professionals. Elevate
                    your thinking through electric discussion and form a lasting
                    intellectual network that extends beyond the course.
                </>
            ),
            alt: "elevation",
            src: "/static/images/lightning.jpg",
        },
    ];

    return <FocusCards cards={cards} />;
}
