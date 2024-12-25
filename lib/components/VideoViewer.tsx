"use client";

import { useState } from "react";

/**
 * Presentational client video component. Returns video if URL is truthy.
 * @notice HTML video tag _must_ have a key in order for React to re-render the component when the URL changes.
 */
export const VideoViewer = ({ videoUrl }: { videoUrl: string }) => {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = () => {
        setIsLoading(false);
    };

    if (videoUrl) {
        return (
            <div className="relative w-full h-full">
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
                >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        );
    }
};
