import { DialogButton, insertJsx$, usePublisher } from "@mdxeditor/editor";

export const ButtonInsertYouTube = () => {
    const insertJsx = usePublisher(insertJsx$);
    // grab the insertDirective action (a.k.a. publisher) from the
    // state management system of the directivesPlugin

    return (
        <DialogButton
            tooltipTitle="Insert Youtube video"
            submitButtonTitle="Insert video"
            dialogInputPlaceholder="Paste the youtube video URL"
            buttonContent="YT"
            onSubmit={(url) => {
                const videoId = new URL(url).searchParams.get("v");
                const videoUrl = `https://www.youtube.com/embed/${videoId}`;
                if (videoId && videoUrl) {
                    insertJsx({
                        name: "EmbedYT",
                        kind: "text",
                        props: { src: videoUrl },
                        children: [
                            {
                                type: "text",
                                value: `YouTube video ${videoId}`,
                            },
                        ],
                    });
                } else {
                    alert("Invalid YouTube URL");
                }
            }}
        />
    );
};
