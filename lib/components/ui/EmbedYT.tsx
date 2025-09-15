"use client";

interface EmbedYTProps extends React.HTMLAttributes<HTMLIFrameElement> {
    src: string;
    title?: string;
    minWidth?: string;
    maxWidth?: string;
    children?: React.ReactNode;
}

export const EmbedYT = (props: EmbedYTProps) => {
    const { children, src, title, maxWidth = "800px", ...otherProps } = props;

    return (
        <section
            style={{ width: "100%", maxWidth: maxWidth }}
            aria-label="YouTube video"
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    overflow: "hidden",
                    paddingTop: "56.25%",
                }}
            >
                <div>
                    <iframe
                        style={{
                            position: "absolute",
                            top: "0",
                            left: "0",
                            right: "0",
                            width: "100%",
                            height: "100%",
                            border: "none",
                        }}
                        src={src}
                        title={title ?? "YouTube video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        {...otherProps}
                    >
                        {children}
                    </iframe>
                </div>
            </div>
        </section>
    );
};
