"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Presentational client video component. Returns video if URL is truthy.
 * @notice HTML video tag _must_ have a key in order for React to re-render the component when the URL changes.
 */
export const VideoViewer = ({ videoUrl }: { videoUrl: string }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isFloating, setIsFloating] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleLoad = () => {
        setIsLoading(false);
    };

    useEffect(() => {
        const checkViewportSize = () => {
            setIsMobileView(window.innerWidth < 768);
        };

        // Check initially
        checkViewportSize();

        // Update on resize
        window.addEventListener("resize", checkViewportSize);

        return () => {
            window.removeEventListener("resize", checkViewportSize);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (isMobileView) {
                setIsFloating(false);
                return;
            }

            // Clear any existing timeout to prevent multiple executions
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }

            // Set a timeout to throttle the execution
            scrollTimeout.current = setTimeout(() => {
                if (!videoContainerRef.current || !placeholderRef.current)
                    return;
                const rect = placeholderRef.current.getBoundingClientRect();

                // Add some hysteresis to prevent flickering near the threshold
                const threshold = -100;
                const hysteresis = 20; // Buffer zone to prevent immediate toggling

                if (!isFloating && rect.top < threshold) {
                    setIsFloating(true);
                } else if (isFloating && rect.top > threshold + hysteresis) {
                    setIsFloating(false);
                }
            }, 50); // 50ms delay helps smooth out the transitions
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, [isFloating, isMobileView]);

    if (!videoUrl) {
        return null;
    }

    return (
        <div
            ref={placeholderRef}
            className="w-full max-h-50vh max-w-[1100px] flex items-center justify-center font-medium text-zinc-400 aspect-video shrink-0 bg-transparent"
        >
            <div
                ref={videoContainerRef}
                className={`${
                    isFloating
                        ? "fixed right-3 bottom-3 rounded-md md:rounded-lg shadow-xl w-3/5 md:max-w-sm lg:max-w-md xl:max-w-lg z-40 aspect-video overflow-hidden"
                        : "relative w-full h-full aspect-video overflow-hidden"
                }`}
            >
                <div
                    className={`absolute z-10 ${
                        isLoading ? "" : "hidden"
                    } skeleton rounded-none w-full h-full`}
                ></div>
                <video
                    key={videoUrl}
                    controls
                    controlsList="nodownload"
                    onLoadedData={handleLoad}
                    className="w-full h-full object-cover"
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};
