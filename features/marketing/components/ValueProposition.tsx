"use client";

import AddIcon from "@mui/icons-material/Add";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { cn } from "lib/utils";
import { cinzel, garamond } from "lib/utils/fonts";
import { useState } from "react";

// Laid out as a disputed question in the manner of the Summa: the doubts a
// prospective student might raise, each answered in turn.
const objections = [
    {
        objection:
            "It seems that a reading list is enough. The great texts are in the public domain, and anyone may read them in order without a guide.",
        reply: (
            <>
                A reading list tells you <em>what</em> to read, not how. Our
                courses give a <b>structured</b>, step-by-step curriculum built
                for mastery rather than exposure: a guided tour through the
                text, not a survey or a haphazard selection. That alone saves
                dozens of hours of searching and vetting.
            </>
        ),
    },
    {
        objection:
            "Further, the lectures and commentaries on any great work are numberless, and one need only search to find them.",
        reply: (
            <>
                Numberless is the difficulty.{" "}
                <b>Two things you can never get back are time and certainty.</b>{" "}
                Our instructors are experts in their texts. They bring you up to
                speed on the hard concepts and cut through the thicket of
                competing interpretations, and every course is vetted for
                quality.
            </>
        ),
    },
    {
        objection:
            "Further, a recorded lecture can be watched at any hour, whereas a live seminar binds one to a schedule.",
        reply: (
            <>
                The binding is the point. A seminar offers more than
                information: it offers <b>access and accountability</b>. Weekly
                live discussion and the commitment of a cohort cannot be
                replicated by a video you can always put off until tomorrow.
            </>
        ),
    },
    {
        objection:
            "Further, a course is made for everyone, and so fits no one's particular questions.",
        reply: (
            <>
                For serious students we offer <b>tailored guidance</b> and
                direct feedback. Personal sessions shape the material around
                your research and your particular sticking points. As with a
                trainer in the gym, someone watching your form finds the weak
                spots you cannot see yourself.
            </>
        ),
    },
    {
        objection:
            "Further, philosophy begins in wonder, and free content is enough to spark wonder.",
        reply: (
            <>
                It begins there, but does not end there. Free content is
                fragmented and often contradictory: it sparks curiosity without
                developing it. We provide the coherence and continuity that
                cultivation requires, with every lecture building on the last.
                Stop collecting pieces; <b>start building your system</b>.
            </>
        ),
    },
    {
        objection:
            "Further, thinking is done alone, at one's own desk, and needs no company.",
        reply: (
            <>
                Philosophy has been a conversation since the first{" "}
                <em>symposium</em>. In a live seminar you join a{" "}
                <b>dedicated cohort</b> of students, academics, and
                professionals. Thought is sharpened in argument, and the
                friendships formed there outlast the course.
            </>
        ),
    },
];

export function ValueProposition() {
    const [open, setOpen] = useState<Set<number>>(new Set());

    const toggle = (i: number) => {
        setOpen((prev) => {
            const next = new Set(prev);
            if (next.has(i)) next.delete(i);
            else next.add(i);
            return next;
        });
    };

    const allOpen = open.size === objections.length;

    return (
        <MotionConfig reducedMotion="user">
            <article
                className={cn(
                    garamond.className,
                    "max-w-2xl mx-auto w-full px-4 text-left text-lg sm:text-xl leading-relaxed text-slate-800 dark:text-slate-200"
                )}
            >
                <header className="pb-8 border-b border-slate-300 dark:border-neutral-700">
                    <p
                        className={cn(
                            cinzel.className,
                            "text-sm tracking-wide text-[#6b0072] dark:text-acid-green"
                        )}
                    >
                        A disputed question
                    </p>
                    <h3 className="mt-2 text-2xl sm:text-3xl leading-snug font-medium text-slate-900 dark:text-white">
                        Whether one ought to study the great texts in a course,
                        when the texts and lectures are freely available.
                    </h3>
                </header>

                <div className="flex justify-end pt-4">
                    <button
                        type="button"
                        onClick={() =>
                            setOpen(
                                allOpen
                                    ? new Set()
                                    : new Set(objections.map((_, i) => i))
                            )
                        }
                        className="cursor-pointer text-base italic text-slate-500 dark:text-slate-400 underline underline-offset-4 decoration-slate-300 dark:decoration-neutral-600 hover:text-[#6b0072] dark:hover:text-acid-green rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b0072] dark:focus-visible:outline-acid-green"
                    >
                        {allOpen ? "Hide all replies" : "Show all replies"}
                    </button>
                </div>

                <ol className="mt-2">
                    {objections.map((o, i) => {
                        const isOpen = open.has(i);
                        const id = `vp-reply-${i}`;
                        return (
                            <li
                                key={o.objection}
                                className="border-b border-slate-200 dark:border-neutral-800"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(i)}
                                    aria-expanded={isOpen}
                                    aria-controls={id}
                                    className="group cursor-pointer w-full text-left py-5 grid grid-cols-[auto_1fr_auto] items-start gap-x-4 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6b0072] dark:focus-visible:outline-acid-green"
                                >
                                    <span
                                        className={cn(
                                            cinzel.className,
                                            "pt-1 text-sm text-slate-400 dark:text-neutral-500 tabular-nums"
                                        )}
                                    >
                                        Obj. {i + 1}
                                    </span>
                                    <span className="italic text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                        {o.objection}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className={cn(
                                            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border border-[#6b0072] text-[#6b0072] dark:border-acid-green dark:text-acid-green transition-colors duration-200 group-hover:bg-[#6b0072] group-hover:text-white dark:group-hover:bg-acid-green dark:group-hover:text-neutral-950",
                                            isOpen &&
                                                "bg-[#6b0072] text-white dark:bg-acid-green dark:text-neutral-950"
                                        )}
                                    >
                                        <AddIcon
                                            fontSize="small"
                                            className={cn(
                                                "transition-transform duration-200",
                                                isOpen && "rotate-45"
                                            )}
                                        />
                                    </span>
                                </button>

                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            id={id}
                                            key="reply"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{
                                                height: "auto",
                                                opacity: 1,
                                            }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                ease: [0.2, 0, 0, 1],
                                            }}
                                            className="overflow-hidden"
                                        >
                                            <p className="mb-6 ml-4 sm:ml-[4.5rem] pl-4 border-l-2 border-[#6b0072] dark:border-acid-green [&_b]:font-medium [&_b]:text-slate-950 dark:[&_b]:text-white">
                                                <span className="font-medium text-[#6b0072] dark:text-acid-green">
                                                    Reply to Objection {i + 1}.
                                                </span>{" "}
                                                {o.reply}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </li>
                        );
                    })}
                </ol>

            </article>
        </MotionConfig>
    );
}
