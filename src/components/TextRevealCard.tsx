"use client";

import React, { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { cn } from "@/util/cn";
import { SchoolOutlined } from "@mui/icons-material";

export const TextRevealCard = ({
    text,
    revealText,
    url,
    children,
    className,
}: {
    text: string;
    revealText: string;
    url: string;
    children?: React.ReactNode;
    className?: string;
}) => {
    const [widthPercentage, setWidthPercentage] = useState(0);
    const cardRef = useRef<HTMLDivElement | any>(null);
    const [left, setLeft] = useState(0);
    const [localWidth, setLocalWidth] = useState(0);
    const [isMouseOver, setIsMouseOver] = useState(false);

    useEffect(() => {
        if (cardRef.current) {
            const { left, width: localWidth } =
                cardRef.current.getBoundingClientRect();
            setLeft(left);
            setLocalWidth(localWidth);
        }
    }, []);

    function mouseMoveHandler(event: any) {
        event.preventDefault();

        const { clientX } = event;
        if (cardRef.current) {
            const relativeX = clientX - left;
            setWidthPercentage((relativeX / localWidth) * 100);
        }
    }

    function mouseLeaveHandler() {
        setIsMouseOver(false);
        setWidthPercentage(0);
    }
    function mouseEnterHandler() {
        setIsMouseOver(true);
    }
    function touchMoveHandler(event: React.TouchEvent<HTMLDivElement>) {
        event.preventDefault();
        const clientX = event.touches[0]!.clientX;
        if (cardRef.current) {
            const relativeX = clientX - left;
            setWidthPercentage((relativeX / localWidth) * 100);
        }
    }

    const rotateDeg = (widthPercentage - 50) * 0.1;
    return (
        <a href={url} target="_blank">
            <div
                onMouseEnter={mouseEnterHandler}
                onMouseLeave={mouseLeaveHandler}
                onMouseMove={mouseMoveHandler}
                onTouchStart={mouseEnterHandler}
                onTouchEnd={mouseLeaveHandler}
                onTouchMove={touchMoveHandler}
                ref={cardRef}
                className={cn(
                    " w-full rounded-lg p-8 relative overflow-hidden",
                    className
                )}
            >
                <div className="h-20 relative flex items-center overflow-hidden">
                    <motion.div
                        style={{
                            width: "100%",
                        }}
                        animate={
                            isMouseOver
                                ? {
                                      opacity: widthPercentage > 0 ? 1 : 0,
                                      clipPath: `inset(0 ${
                                          100 - widthPercentage
                                      }% 0 0)`,
                                  }
                                : {
                                      clipPath: `inset(0 ${
                                          100 - widthPercentage
                                      }% 0 0)`,
                                  }
                        }
                        transition={
                            isMouseOver ? { duration: 0 } : { duration: 0.4 }
                        }
                        className="absolute bg-indigo-400 dark:bg-purple-950 z-20  will-change-transform"
                    >
                        <p
                            style={{
                                textShadow: "4px 4px 15px rgba(0,0,0,0.2)",
                            }}
                            className="text-base sm:text-[2.5rem] py-10 font-bold text-black dark:text-white bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-neutral-300"
                        >
                            {revealText}
                        </p>
                    </motion.div>
                    <motion.div
                        animate={{
                            left: `${widthPercentage}%`,
                            rotate: `${rotateDeg}deg`,
                            opacity: widthPercentage > 0 ? 1 : 0,
                        }}
                        transition={
                            isMouseOver ? { duration: 0 } : { duration: 0.4 }
                        }
                        className="h-40 w-[8px] bg-gradient-to-b from-transparent via-neutral-800 to-transparent absolute z-50 will-change-transform"
                    ></motion.div>

                    <div className=" overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,white,transparent)]">
                        <p className="text-base sm:text-[2.5rem] py-10 font-bold bg-clip-text text-transparent bg-gray-800 dark:bg-slate-500">
                            {text}
                        </p>
                        <MemoizedStars />
                    </div>
                </div>
                {children}
            </div>
        </a>
    );
};

export const TextRevealCardTitle = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <h2
            className={twMerge(
                "text-slate-800 dark:text-white text-lg mb-2",
                className
            )}
        >
            <SchoolOutlined />
            {children}
        </h2>
    );
};

export const TextRevealCardDescription = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <p
            className={twMerge(
                "text-slate-800 dark:text-slate-100 text-sm",
                className
            )}
        >
            {children}
        </p>
    );
};

const Stars = () => {
    const randomMove = () => Math.random() * 4 - 2;
    const randomOpacity = () => Math.random();
    const random = () => Math.random();
    return (
        <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
                <motion.span
                    key={`star-${i}`}
                    animate={{
                        top: `calc(${random() * 100}% + ${randomMove()}px)`,
                        left: `calc(${random() * 100}% + ${randomMove()}px)`,
                        opacity: randomOpacity(),
                        scale: [1, 1.2, 0],
                    }}
                    transition={{
                        duration: random() * 10 + 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        position: "absolute",
                        top: `${random() * 100}%`,
                        left: `${random() * 100}%`,
                        width: `2px`,
                        height: `2px`,
                        backgroundColor: "white",
                        borderRadius: "50%",
                        zIndex: 1,
                    }}
                    className="inline-block"
                ></motion.span>
            ))}
        </div>
    );
};

export const MemoizedStars = memo(Stars);
