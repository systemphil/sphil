import { ReactNode } from "react";

const Button = ({ children }: {children?: ReactNode}) => {
    return(
        <button 
            className="dark:bg-dark-green-hsl dark:hover:bg-emerald-700 bg-neutral-300 hover:bg-neutral-400 duration-300 p-2 rounded-lg shadow-lg hover:drop-shadow-xl"
        >
            {children}
        </button>
    );
}

export default Button;