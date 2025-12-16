"use client";

import { motion } from "framer-motion";

export function FadeIn({
    children,
    className,
    noVertical,
    delay,
    viewTriggerOffset,
}: {
    children: React.ReactNode;
    className?: string;
    noVertical?: boolean;
    delay?: number;
    viewTriggerOffset?: boolean;
}) {
    const fadeUpVariants = {
        initial: {
            opacity: 0,
            y: noVertical ? 0 : 24,
        },
        animate: {
            opacity: 1,
            y: 0,
        },
    };

    return (
        <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{
                once: true,
                margin: viewTriggerOffset ? "-128px" : "0px",
            }}
            variants={fadeUpVariants}
            className={className}
            transition={{
                duration: 1,
                delay: delay || 0,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
        >
            {children}
        </motion.div>
    );
}
