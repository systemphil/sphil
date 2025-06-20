"use client";

import { actionRefreshVideoUrl } from "lib/server/actions";
import { useEffect, useRef, useState } from "react";

/**
 * VideoViewer with auto-refresh capabilities for expired signed URLs
 */
export const VideoViewer = ({
    videoUrl: initialVideoUrl,
    videoId,
    fileName,
}: {
    videoUrl: string;
    videoId: string;
    fileName: string;
}) => {
    const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
    const [isLoading, setIsLoading] = useState(true);
    const [isFloating, setIsFloating] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [isUrlExpired, setIsUrlExpired] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoContainerRef = useRef<HTMLDivElement>(null);
    const placeholderRef = useRef<HTMLDivElement>(null);
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    // Track last activity time to avoid unnecessary URL refreshes
    const lastActivityRef = useRef<number>(Date.now());

    const handleLoad = () => {
        setIsLoading(false);
        // Restore playback position after URL refresh if needed
        if (videoRef.current && currentTime > 0) {
            videoRef.current.currentTime = currentTime;
        }
        lastActivityRef.current = Date.now();
    };

    const refreshVideoUrl = async () => {
        try {
            console.log("Attempting refresh...");
            const resp = await actionRefreshVideoUrl({
                fileName,
                videoId,
            });

            if (resp.status !== "Ok") {
                throw new Error(resp.error);
            }

            return resp.data;
        } catch (error) {
            console.error("Error refreshing video URL:", error);
            throw error;
        }
    };

    const handleVideoPlay = async () => {
        if (isLoading) {
            return;
        }

        const now = Date.now();

        // If more than N minutes since last activity
        if (now - lastActivityRef.current > 60 * 60 * 1000) {
            setIsUrlExpired(true);
            setIsLoading(true);

            try {
                // Save current playback position before refreshing URL
                if (videoRef.current) {
                    setCurrentTime(videoRef.current.currentTime);
                }

                // Get fresh URL from API
                const freshUrl = await refreshVideoUrl();
                console.log("Fresh url", freshUrl);
                setVideoUrl(freshUrl);
                setIsUrlExpired(false);
                lastActivityRef.current = now;
            } catch (error) {
                console.error("Failed to refresh video URL:", error);
            }
        }
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

    useEffect(() => {
        if (typeof document === "undefined") {
            return;
        }
        const handleFullscreenChange = () => {
            const fullscreenElement = document.fullscreenElement;
            setIsFullscreen(!!fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
        };
    }, []);

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
                    } skeleton rounded-none w-full h-full flex items-center justify-center`}
                >
                    {isUrlExpired && (
                        <div className="bg-black bg-opacity-70 p-4 rounded text-white text-center">
                            <p>Refreshing video...</p>
                        </div>
                    )}
                </div>
                <video
                    ref={videoRef}
                    key={videoUrl}
                    playsInline
                    controls
                    controlsList="nodownload"
                    onLoadedData={handleLoad}
                    onPlay={handleVideoPlay}
                    onSeeked={handleVideoPlay}
                    className={`w-full h-full ${isFullscreen ? "object-contain" : "object-cover"}`}
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};
