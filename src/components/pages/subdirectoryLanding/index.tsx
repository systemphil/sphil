import Heading from "@/components/Heading";
import SubHeroBackground from "./SubHeroBackground";
import { Card } from 'nextra/components'

const SubdirectoryLanding = ({subdirectory}: {subdirectory: string}) => {

    return(
        <main>
            <section className="relative flex flex-col items-center justify-start w-full h-screen overflow-hidden mb-10">
                <SubHeroBackground>
                    <div className="flex flex-col items-center justify-center">
                        <Heading>{subdirectory.toUpperCase()}</Heading>
                        <div className="flex flex-wrap justify-between gap-4 bg-white rounded-lg dark:bg-transparent p-8 shadow-[10px_10px_50px_50px_rgba(255,255,255,0.8)] dark:shadow-none">
                            <Card
                                icon={" 📄 "}
                                title="Guides"
                                href={`/${subdirectory}/guides`}
                            >_</Card>
                            <Card
                                icon={" 📄 "}
                                title="Reference"
                                href={`/${subdirectory}/reference`}
                            >_</Card>
                        </div>
                    </div>
                </SubHeroBackground>
            </section>
        </main>
    );
}

export default SubdirectoryLanding; 