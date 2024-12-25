export const EmbedYT = (props: any) => {
    const {
        children,
        src,
        minWidth = "400px",
        maxWidth = "800px",
        ...otherProps
    } = props;

    return (
        <section
            style={{ width: "100%", minWidth: minWidth, maxWidth: maxWidth }}
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
                        width="560"
                        height="315"
                        src={src}
                        title="Video player"
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
