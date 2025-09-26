/* cSpell:disable */

import { Img, Link, Section } from "@react-email/components";

export const VideoLink = ({ text, ytUrl }: { text: string; ytUrl: string }) => {
    /**
     * Deconstructs a YouTube URL to get the video ID and constructs the
     * URL for the medium-quality thumbnail image.
     * * @param {string} url The full YouTube URL (e.g., watch?v=ID, youtu.be/ID).
     * @returns {string | null} The URL for the medium-quality thumbnail,
     * or null if the video ID cannot be extracted.
     */
    const getYouTubeMediumThumbnailUrl = (url: string) => {
        // Regular expression to extract the 11-character video ID from various formats
        // It handles: watch?v=ID, youtu.be/ID, embed/ID, and others.
        const videoIdMatch = url.match(
            /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
        );

        // The video ID is in the first capture group (index 1)
        const videoId = videoIdMatch ? videoIdMatch[1] : null;

        if (videoId) {
            return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }

        return "";
    };

    return (
        <Section style={{ textAlign: "center" }}>
            <Link href={ytUrl} target="_blank">
                <Img
                    src={getYouTubeMediumThumbnailUrl(ytUrl)}
                    alt="Course Video Preview"
                    width="100%"
                    style={{
                        maxWidth: "600px",
                        borderRadius: "8px",
                        border: "1px solid #ccc",
                    }}
                />
                <div
                    style={{
                        marginTop: "5px",
                        color: "#0070f3",
                        textDecoration: "underline",
                    }}
                >
                    {text}
                </div>
            </Link>
        </Section>
    );
};
