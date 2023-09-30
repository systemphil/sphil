import Card from "@/components/Card";
import HeroBackground from "./HeroBackground";
import Link from "next/link";
import { cinzel } from "@/util/fonts";

const LandingPage = () => {

    // TODO change h to h-full when we have added more stuff to the landing page
    return(
        <>
            <main className="relative flex flex-col items-center justify-start w-full h-full overflow-hidden">
                <HeroBackground />
                <div className="relative flex flex-col items-center justify-center z-10">
                    <h1 className={`${cinzel.variable} font-serif mt-12 z-10 lg:!mt-20 mx-6 w-[300px] md:!w-full font-extrabold text-4xl md:text-5xl lg:text-6xl  leading-tight xl:leading-snug text-center pb-4 bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]`}>
                        Open Source Philosophy
                    </h1>
                    <p className="mx-6 z-10 text-xl max-h-[112px] md:max-h-[96px] w-[315px] md:w-[600px] md:text-2xl font-space-grotesk text-center text-[#666666] dark:text-[#888888]">
                        sPhil is a collaborative platform for developing philosophy through open-source principles, 
                        emphasizing the collective nature of thinking.
                    </p>
                    <div className="mt-16 mb-36 flex justify-center items-center flex-wrap gap-16">
                        <Link href="/hegel">
                            <Card>
                                <p className="text-5xl text-center">HEGEL</p>
                                <p>Get in on the action here!</p>
                            </Card>
                        </Link>
                        <Link href="/kant">
                            <Card>
                                <p className="text-5xl text-center">KANT</p>
                                <p>Here we go! Here we go!</p>
                            </Card>
                        </Link>
                    </div>
                </div>
            </main>
        </>
    )
}

export default LandingPage;