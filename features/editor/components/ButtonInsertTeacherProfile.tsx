import { DialogButton, insertJsx$, usePublisher } from "@mdxeditor/editor";
import { SUPPORTED_TEACHER_PROFILES } from "./EmbedTeacherProfile";

export const ButtonInsertTeacherProfile = () => {
    const insertJsx = usePublisher(insertJsx$);
    // grab the insertDirective action (a.k.a. publisher) from the
    // state management system of the directivesPlugin

    return (
        <DialogButton
            autocompleteSuggestions={SUPPORTED_TEACHER_PROFILES}
            tooltipTitle="Insert teacher profile"
            submitButtonTitle="Insert teacher"
            dialogInputPlaceholder="name:optional-title"
            buttonContent="🧑‍🏫"
            onSubmit={(input) => {
                const inputLowercase = input.toLocaleLowerCase();
                if (
                    inputLowercase &&
                    SUPPORTED_TEACHER_PROFILES.includes(
                        inputLowercase.split(":")[0]
                    )
                ) {
                    insertJsx({
                        name: "EmbedTeacherProfile",
                        kind: "text",
                        props: { teacherInput: inputLowercase },
                        children: [
                            {
                                type: "text",
                                value: `Teacher profile ${inputLowercase}`,
                            },
                        ],
                    });
                } else {
                    alert("Unsupported teacher name");
                }
            }}
        />
    );
};
