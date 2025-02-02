import { CardTeamMember } from "lib/components/CardTeamProfile";

export const EmbedTeacherProfile = (props: any) => {
    const {
        children,
        teacher,
        minWidth = "400px",
        maxWidth = "800px",
        ...otherProps
    } = props;

    const renderFilip = () => {
        return (
            <CardTeamMember
                name="Filip Niklas"
                title="Tech Lead"
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
                }}
            >
                {teacher === "filip" && renderFilip()}
            </div>
        </section>
    );
};
