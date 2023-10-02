import HeroBackground from "./HeroBackground";
import CardFancy from "@/components/CardFancy";
import Heading from "@/components/Heading";
import Paragraph from "@/components/Paragraph";

const LandingPage = () => {

    // TODO change h to h-full when we have added more stuff to the landing page
    return(
        <main>
            <section className="relative flex flex-col items-center justify-start w-full h-full overflow-hidden">
                <HeroBackground />
                <div className="relative flex flex-col items-center justify-center z-10 py-28">
                    <Heading>Open Source Philosophy</Heading>
                    <Paragraph style="grotesk">
                        sPhil is a collaborative platform for developing philosophy through open-source principles, emphasizing the collective nature of thinking.
                    </Paragraph>
                    <div className="mt-16 mb-24 flex justify-center items-center flex-wrap gap-16">
                        <CardFancy 
                            title={"HEGEL"}
                            tagline={"Discover the power of dialectical thought and immanent critique!"}
                            href={"/hegel"}
                            buttons={[
                                { title: "Guides", href: "/hegel/guides" },
                                { title: "Reference", href: "/hegel/reference" }
                            ]}
                        />
                        <CardFancy 
                            title={"KANT"}
                            tagline={"Learn why Kant is the philosopher of the enlightenment bar none!"}
                            href={"/kant"}
                            buttons={[
                                { title: "Guides", href: "/kant/guides" },
                                { title: "Reference", href: "/kant/reference" }
                            ]}
                        />
                    </div>
                </div>
                
            </section>
            <article className="relative flex flex-col items-center justify-start w-full h-full">
                <div className="absolute top-0 h-36 w-full -translate-y-full bg-gradient-to-t from-[#fff6f6] to-transparent dark:from-[#10b981] pointer-events-none opacity-10" />
                <div className="py-20 flex flex-col items-center justify-center">
                    <Heading>What is sPhil?</Heading>
                    <div className="flex flex-col gap-6 max-w-2xl">
                        <div aria-hidden="true" className="absolute inset-48 grid grid-cols-2 -space-x-52 opacity-40 dark:opacity-20">
                            <div className="blur-[106px] h-56 bg-gradient-to-br from-purple-700 to-purple-400 dark:from-blue-700"></div>
                            <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-400 to-sky-300 dark:to-indigo-600"></div>
                        </div>
                        <Paragraph>
                            Introducing the platform where the realms of philosophy and software converge seamlessly.
                        </Paragraph>
                        <Paragraph>
                            At our platform, we&apos;ve reimagined the way philosophy is explored and shared in the digital age. We&apos;ve harnessed the power of the world&apos;s leading collaborative development platform to create a dynamic and ever-evolving space where code and content continuously overlap.
                        </Paragraph>
                        <Paragraph>
                            Here, philosophy isn&apos;t confined to static texts or stagnant discussions. Instead, it&apos;s a living, breathing entity that evolves alongside the rapid advancements in the digital world. Our GitHub repository serves as the epicenter of this synergy, where philosophers, thinkers, and developers unite to explore, dissect, and refine philosophical ideas in real-time.
                        </Paragraph>
                        <Paragraph>
                            Our commitment to software principles ensures that the philosophy presented on our website is not only rigorous and thought-provoking but also highly accessible and user-friendly. We embrace open-source principles, inviting contributions from anyone who wishes to join the conversation, whether they&apos;re an established philosopher or a coding enthusiast with a passion for philosophy.
                        </Paragraph>
                        <Paragraph>
                            Through version control, continuous integration, and collaborative coding practices, we&apos;ve created a digital philosophy ecosystem that adapts and grows organically. This approach ensures that our content remains relevant, accurate, and engaging, reflecting the ever-evolving landscape of philosophical thought.
                        </Paragraph>
                        <Paragraph>
                            Join us on this exhilarating journey where philosophy and code converge, fostering an environment where the pursuit of knowledge is as dynamic and interconnected as the world itself. Welcome to the future of philosophical exploration, where ideas and software unite to open the horizons of intellectual discourse.
                        </Paragraph>
                    </div>
                </div>

            </article>
        </main>
    );
}

export default LandingPage;