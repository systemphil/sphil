import { DialogButton, insertJsx$, usePublisher } from "@mdxeditor/editor";

export const ButtonInsertTeacherProfile = () => {
    const insertJsx = usePublisher(insertJsx$);
    // grab the insertDirective action (a.k.a. publisher) from the
    // state management system of the directivesPlugin

    return (
        <DialogButton
            tooltipTitle="Insert teacher profile"
            submitButtonTitle="Insert teacher"
            dialogInputPlaceholder="filip or ahilleas"
            buttonContent="🧑‍🏫"
            onSubmit={(name) => {
                const nameLowercase = name.toLocaleLowerCase();
                if (
                    nameLowercase &&
                    (nameLowercase === "filip" || nameLowercase === "ahilleas")
                ) {
                    insertJsx({
                        name: "EmbedTeacherProfile",
                        kind: "text",
                        props: { teacher: nameLowercase },
                        children: [
                            {
                                type: "text",
                                value: `Teacher profile ${nameLowercase}`,
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
