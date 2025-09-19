import { CardTeamMember } from "lib/components/CardTeamProfile";

export const SUPPORTED_TEACHER_PROFILES = ["filip", "ahilleas", "christopher"];

type EmbedTEacherProfileProps = {
    children?: React.ReactNode;
    teacherInput: string;
    maxWidth?: string;
    minWidth?: string;
};

export const EmbedTeacherProfile = (props: EmbedTEacherProfileProps) => {
    const { teacherInput, maxWidth = "800px" } = props;

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
                title={title ? title : "Business Lead"}
                image="/images/team/ahilleas.jpg"
            >
                Ahilleas Rokni, Ph.D., completed his PhD in 2022 under the
                supervision of Professor Stephen Houlgate at the University of
                Warwick. The title of his thesis is{" "}
                <i>
                    From Logic to Nature: A study of Objectivity and the Idea in
                    Hegel&apos;s Science of Logic
                </i>
                . Ahilleas has published articles, edited journals, given talks,
                and organized numerous conferences around Hegel, aesthetics, and
                the history of philosophy more generally. Ahilleas has
                previously given courses at the University of Warwick on topics
                ranging from political philosophy to contemporary debates in
                metaphysics. Ahilleas&apos; main research areas are metaphysics,
                ontology, philosophy of nature, philosophy of science,
                aesthetics, and systematic philosophy. Ahilleas is a co-founder
                of sPhil and writes articles for the sPhil Encyclopaedia.
            </CardTeamMember>
        );
    };

    const renderChristopher = (title?: string) => {
        return (
            <CardTeamMember
                name="Christopher Satoor"
                title={title ? title : "Teacher"}
                image="/images/team/christopher.png"
            >
                Christopher Satoor is a doctoral candidate (ABD) in the
                Department of Humanities at York University. His areas of
                specialization are Classical German philosophy; German
                Romanticism, German idealism (Kant and Fichte) with
                concentration on Friedrich Wilhelm Joseph Schelling. Christopher
                is also co-founder and the president{" "}
                <a
                    href="https://www.youtube.com/@IdealistSocNA/videos"
                    target="_blank"
                >
                    The Idealist Society of North America
                </a>
                . Christopher is in the final stages of completing his
                dissertation, an interdisciplinary project spanning philosophy,
                religious studies, and science and technology studies. Over the
                past 12 years, he has taught a wide range of courses in
                philosophy social sciences, and the humanities. He currently
                works as an educator, private instructor, and teacher.
            </CardTeamMember>
        );
    };

    return (
        <section
            style={{ width: "100%", maxWidth: maxWidth }}
            aria-label="Teacher profile"
        >
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    overflow: "hidden",
                    paddingTop: "56.25%",
                    padding: "2px",
                    marginTop: "16px",
                }}
            >
                {teacher === "filip" && renderFilip(title)}
                {teacher === "ahilleas" && renderAhilleas(title)}
                {teacher === "christopher" && renderChristopher(title)}
            </div>
        </section>
    );
};
