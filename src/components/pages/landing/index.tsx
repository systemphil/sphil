import Card from "@/components/Card";
import HeroBackground from "./HeroBackground";
import Link from "next/link";
import { cinzel } from "@/util/fonts";
import Button from "@/components/Button";

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
                        sPhil is a collaborative platform for developing philosophy through open-source principles, emphasizing the collective nature of thinking.
                    </p>
                    <div className="mt-16 mb-36 flex justify-center items-center flex-wrap gap-16">
                        <Card>
                            <Link href="/hegel">
                                <p className="text-5xl font-bold text-center hover:text-slate-600 duration-300">HEGEL</p>
                                <p className="w-[300px] text-center mt-2 text-lg text-stone-500">Discover the power of dialectical thought and immanent critique!</p>
                            </Link>
                            <div className="flex gap-4 mt-2">
                                <Link href="/hegel/guides">
                                    <Button>Guides</Button>
                                </Link>
                                <Link href="/hegel/reference">
                                    <Button>Reference</Button>
                                </Link>
                            </div>
                        </Card>
                        
                        <Card>
                            <p className="text-5xl font-bold text-center">KANT</p>
                            <p className="w-[300px] text-center mt-2">Learn why Kant is the philosopher of enlightenment bar none!</p>
                            <div className="flex gap-4 mt-2">
                                <Link href="/kant/guides">
                                    <Button>Guides</Button>
                                </Link>
                                <Link href="/kant/reference">
                                    <Button>Reference</Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </>
    )
}

export default LandingPage;