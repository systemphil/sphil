"use client";

import React from "react";
import {
    TextRevealCard,
    TextRevealCardDescription,
    TextRevealCardTitle,
} from "./TextRevealCard";

export function SymposiaCard() {
    return (
        <TextRevealCard
            text="Learn"
            revealText="Master"
            url="https://symposia.systemphil.com"
            className="bg-gradient-to-b from-indigo-400 from-50% via-purple-400 via-75%  to-pink-400 to-90% dark:from-purple-950 dark:to-purple-800"
        >
            <TextRevealCardTitle>
                &nbsp;Searching for Extra Guidance?
            </TextRevealCardTitle>
            <TextRevealCardDescription>
                Visit Symposia to find detailed courses on a variety of topics.
            </TextRevealCardDescription>
        </TextRevealCard>
    );
}
