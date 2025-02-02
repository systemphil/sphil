import { CardTeamMember } from "lib/components/CardTeamProfile";

type EmbedTEacherProfileProps = {
    children?: React.ReactNode;
    teacherInput: string;
    maxWidth?: string;
    minWidth?: string;
};

export const EmbedTeacherProfile = (props: EmbedTEacherProfileProps) => {
    const { teacherInput, minWidth = "400px", maxWidth = "800px" } = props;

    const getTeacherAndTitle = (teacherInput: string) => {
        if (!teacherInput.includes(":")) {
            return {
                teacher: teacherInput,
                title: undefined,
            };
        }
        const teacher = teacherInput.split(":")[0];

        const title = teacherInput
            .split(":")[1]
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

        return {
            teacher,
            title,
        };
    };

    const { teacher, title } = getTeacherAndTitle(teacherInput);

    const renderFilip = (title?: string) => {
        return (
            <CardTeamMember
                name="Filip Niklas"
                title={title ? title : "Tech Lead"}
                image="/images/team/filip.jpg"
            >
                Filip Niklas, Ph.D., is a co-founder and the tech lead of sPhil.
                By day he works as a software developer, and by night he works
                on sPhil, writes poetry and teaches philosophy. He completed his
                PhD in philosophy in 2022 under the supervision of Professor
                Stephen Houlgate at the University of Warwick. The title of his
                thesis was Hegel&apos;s{" "}
                <em>
                    Critique of Determinism: Justifying Unfreedom as a Moment of
                    Freedom
                </em>
                . Filip&apos;s main research areas are systematic philosophy,
                metaphysics, ontology, essence, freedom, determinism, and
                maintains an otherwise broad interest in all the dimensions of
                intelligence and reason. Filip is also an incurable fan of the
                art and poetry of William Blake.
            </CardTeamMember>
        );
    };

    return (
        <section
            style={{ width: "100%", minWidth: minWidth, maxWidth: maxWidth }}
            aria-label="Teacher profile"
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    overflow: "hidden",
                    paddingTop: "56.25%",
                    padding: "16px",
                }}
            >
                {teacher === "filip" && renderFilip(title)}
            </div>
        </section>
    );
};
