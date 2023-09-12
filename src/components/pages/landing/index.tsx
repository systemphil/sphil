

const LandingPage = () => {

    // TODO change h to h-full when we have added more stuff to the landing page
    return(
        <>
            <main className="relative flex flex-col items-center justify-center w-full h-[700px] overflow-hidden">

                <h1 className="mt-12 lg:!mt-20 mx-6 w-[300px] md:!w-full font-extrabold text-5xl lg:text-6xl  leading-tight xl:leading-snug text-center pb-4 bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]">
                    Open Source Philosophy
                </h1>
                <p className="mx-6 text-xl max-h-[112px] md:max-h-[96px] w-[315px] md:w-[660px] md:text-2xl font-space-grotesk text-center text-[#666666] dark:text-[#888888]">
                    sPhil is a collaborative platform for developing philosophy through open-source principles, 
                    emphasizing the collective nature of the thinking.
                </p>
            
            </main>
        </>
    )
}

export default LandingPage;