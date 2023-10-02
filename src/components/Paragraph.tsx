type ParagraphProps = {
    children: React.ReactNode;
    style?: 'base' | 'grotesk';
};

const Paragraph = ({children, style = 'base'}: ParagraphProps) => {
    const baseClasses = `mx-6 z-10 text-[#666666] dark:text-[#888888]`
    
    switch (style) {
    case 'grotesk':
        return <p className={`${baseClasses} text-center text-xl md:text-2xl font-space-grotesk max-h-[112px] md:max-h-[96px] w-[315px] md:w-[600px]`}>{children}</p>;
    case 'base':
        return <p className={`${baseClasses} text-justify text-lg md:text-xl`}>{children}</p>;
    }
}

export default Paragraph;