"use client";

import {
    motion,
    useMotionTemplate,
    useMotionValue,
    type MotionStyle,
    type MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";

type WrapperStyle = MotionStyle & {
    "--x": MotionValue<string>;
    "--y": MotionValue<string>;
};

/**
 * Thanks to TypeHero for the code! Check out their stuff!
 * @link https://github.com/typehero/typehero
 */
export const GlowBoundary = ({ children }: { children: React.ReactNode }) => {
    const [mounted, setMounted] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const isMobile = useIsMobile();

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        if (isMobile) return;
        if (!currentTarget) return;
        const { left, top } = (
            currentTarget as HTMLElement
        ).getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <motion.div
            className="animated-glow dark:animated-glow relative w-full drop-shadow-[0_0_15px_rgba(49,49,49,0.2)] dark:drop-shadow-[0_0_15px_rgba(49,49,49,0.2)]"
            // @ts-ignore
            onMouseMove={handleMouseMove}
            style={
                {
                    "--x": useMotionTemplate`${mouseX}px`,
                    "--y": useMotionTemplate`${mouseY}px`,
                } as WrapperStyle
            }
        >
            {mounted ? children : null}
        </motion.div>
    );
};

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const isSmall = window.matchMedia("(max-width: 768px)").matches;
        const isMobile = Boolean(
            /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.exec(
                userAgent
            )
        );

        const isDev = process.env.NODE_ENV !== "production";
        if (isDev) setIsMobile(isSmall || isMobile);

        setIsMobile(isSmall && isMobile);
    }, []);

    return isMobile;
}
