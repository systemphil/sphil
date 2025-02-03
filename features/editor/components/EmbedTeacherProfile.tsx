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
                Filip Niklas, Ph.D., completed his PhD in philosophy in 2022
                under the supervision of Professor Stephen Houlgate at the
                University of Warwick. The title of his thesis was{" "}
                <i>
                    Hegel&apos;s Critique of Determinism: Justifying Unfreedom
                    as a Moment of Freedom
                </i>
                . Filip has published articles, edited journals, given talks and
                organized numerous{" "}
                <a href="https://hegelwarwick.wordpress.com/" target="_blank">
                    conferences
                </a>{" "}
                around Hegel, Aristotle, Collingwood, Kant, Blake and others.
                Filip has previously created and given courses at Bishop&apos;s
                University, the University of Warwick and the Halkyon Academy.
                Filip&apos;s main research areas are systematic philosophy,
                metaphysics, ontology, essence, freedom, determinism, and
                maintains an otherwise broad interest in all the dimensions of
                intelligence and reason. Filip is a co-founder sPhil, engineers
                the web platform and writes articles for the sPhil
                Encyclopaedia.
            </CardTeamMember>
        );
    };

    const renderAhilleas = (title?: string) => {
        return (
            <CardTeamMember
                name="Ahilleas Rokni"
                title="Business Lead"
                image="/images/team/ahilleas.jpg"
            >
                Ahilleas Rokni completed his PhD thesis in philosophy in 2022
                under the supervision of Professor Stephen Houlgate at the
                University of Warwick. His thesis aimed to give an account of
                the much-debated move from the <i>Science of Logic</i> to the{" "}
                <i>Philosophy of Nature</i> in Hegel&apos;s system.
                Ahilleas&apos;s main research concerns are Hegel&apos;s logic,
                philosophy of nature, philosophy of science, and aesthetics.
                Ahilleas is a co-founder and the business lead of sPhil.
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
                {teacher === "ahilleas" && renderAhilleas(title)}
            </div>
        </section>
    );
};
