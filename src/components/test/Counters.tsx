"use client";

// Example from https://beta.reactjs.org/learn

import { useState } from "react";

export function Counters() {
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }

    return (
        <div>
            <button
                onClick={handleClick}
                className="border bg-red-300 dark:bg-yellow-300 p-8 rounded-md hover:bg-emerald-400 dark:hover:bg-amber-700"
            >
                Clicked {count} times
            </button>
        </div>
    );
}
