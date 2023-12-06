import CardTeamMember from "@/components/CardTeamMember";


const TeamPage = () => {

    return(
        <div className="flex flex-col container justify-center w-full items-center">
            <h1 className="text-4xl font-bold my-16">Meet Our Team</h1>
            <div className="flex justify-center gap-16 flex-wrap mb-60">
                <CardTeamMember 
                    name="Filip Niklas" 
                    title="Tech Lead" 
                    image="/images/team/filip.jpg"
                >
                    Filip Niklas, Ph.D., is a co-founder and the tech lead of sPhil. By day he works as a software developer, and by night he works on sPhil, writes poetry and teaches philosophy. He completed his PhD in philosophy in 2022 under the supervision of Professor Stephen Houlgate at the University of Warwick. The title of his thesis was Hegel&apos;s <em>Critique of Determinism: Justifying Unfreedom as a Moment of Freedom</em>. Filip&apos;s main research areas are systematic philosophy, metaphysics, ontology, essence, freedom, determinism, and maintains an otherwise broad interest in all the dimensions of intelligence and reason. Filip is also an incurable fan of the art and poetry of William Blake.
                </CardTeamMember>
                <CardTeamMember 
                    name="Ahilleas Rokni" 
                    title="Business Lead" 
                    image="/images/team/ahilleas.jpg"
                >
                    Ahilleas Rokni, Ph.D., is a co-founder and the business lead of sPhil. He completed his PhD thesis in philosophy in 2022 under the supervision of Professor Stephen Houlgate at the University of Warwick. His thesis aimed to give an account of the much-debated move from the <em>Science of Logic</em> to the <em>Philosophy of Nature</em> in Hegel&apos;s system. Ahilleas&apos;s main research concerns are Hegel&apos;s logic, philosophy of nature, philosophy of science, and aesthetics.
                </CardTeamMember>
            </div>
        </div>
    )
}

export default TeamPage;