"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "lib/utils";

const BoxesCore = ({ className, ...rest }: { className?: string }) => {
    const rows = new Array(30).fill(1);
    const cols = new Array(50).fill(1);
    const colors = [
        "#93c5fd",
        "#f9a8d4",
        "#86efac",
        "#fde047",
        "#fca5a5",
        "#d8b4fe",
        "#93c5fd",
        "#a5b4fc",
        "#c4b5fd",
    ];
    const getRandomColor = () => {
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <div
            style={{
                transform: `translate(-40%,-60%) skewX(-38deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
            }}
            className={cn(
                "absolute -top-1/4 left-1/4 z-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 p-4",
                className
            )}
            {...rest}
        >
            {rows.map((_, i) => (
                <motion.div
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    key={`row` + i}
                    className="relative h-8 w-16 border-l border-slate-200 dark:border-slate-800/75"
                >
                    {cols.map((_, j) => (
                        <motion.div
                            whileHover={{
                                backgroundColor: `${getRandomColor()}`,
                                transition: { duration: 0 },
                            }}
                            animate={{
                                transition: { duration: 2 },
                            }}
                            // eslint-disable-next-line @eslint-react/no-array-index-key
                            key={`col` + j}
                            className="relative h-8 w-16 border-t border-r border-slate-200 dark:border-slate-800/75"
                        >
                            {j % 2 === 0 && i % 2 === 0 ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-slate-200 dark:text-slate-800/75"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v12m6-6H6"
                                    />
                                </svg>
                            ) : null}
                        </motion.div>
                    ))}
                </motion.div>
            ))}
        </div>
    );
};

export const BackgroundBoxes = React.memo(BoxesCore);
