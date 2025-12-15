"use client";

import { useEffect, useState } from "react";
import {
    TextRevealCardDescription,
    TextRevealCardTitle,
    TextRevealCard,
} from "./TextRevealCard";

export function CoursesMarketingCard() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch by only rendering once mounted
    if (!isMounted) {
        return null;
    }

    return (
        <TextRevealCard
            text="Learn"
            revealText="Master"
            url="https://sphil.xyz/courses"
            className="bg-linear-to-b from-indigo-400 from-50%  to-pink-400 to-90% dark:from-purple-950 dark:to-purple-800"
        >
            <TextRevealCardTitle>
                &nbsp;Searching for Extra Guidance?
            </TextRevealCardTitle>
            <TextRevealCardDescription>
                Visit our Courses to find step-by-step guidance on a variety of
                topics.
            </TextRevealCardDescription>
        </TextRevealCard>
    );
}
