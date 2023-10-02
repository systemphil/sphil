import { cinzel } from "@/util/fonts";

type HeadingProps = {
    children: React.ReactNode;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};
  
const Heading = ({ children, as = 'h1' }: HeadingProps) => {
    const baseClasses = `${cinzel.variable} font-serif z-10 mx-6 w-[300px] md:!w-full font-extrabold leading-tight xl:leading-snug text-center pb-4 bg-clip-text text-transparent bg-gradient-to-b from-black/80 to-black dark:from-white dark:to-[#AAAAAA]`
    switch (as) {
    case 'h1':
        return <h1 className={`${baseClasses} text-4xl md:text-5xl lg:text-6xl`}>{children}</h1>;
    case 'h2':
        return <h2 className={`${baseClasses} text-3xl md:text-4xl lg:text-5xl`}>{children}</h2>;
    case 'h3':
        return <h3 className={`${baseClasses} text-2xl md:text-3xl lg:text-4xl`}>{children}</h3>;
    case 'h4':
        return <h4 className={`${baseClasses} text-xl md:text-2xl lg:text-3xl`}>{children}</h4>;
    case 'h5':
        return <h5 className={`${baseClasses} text-lg md:text-xl lg:text-2xl`}>{children}</h5>;
    case 'h6':
        return <h6 className={`${baseClasses} text-md md:text-lg lg:text-xl`}>{children}</h6>;
    }
};

export default Heading;