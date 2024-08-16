import { MouseEventHandler, ReactNode } from "react";

const Button = ({
    children,
    onClick,
}: {
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
}) => {
    return (
        <button
            onClick={onClick}
            className="dark:bg-dark-green-hsl dark:hover:bg-emerald-700 bg-neutral-300 hover:bg-neutral-400 duration-300 p-2 rounded-lg shadow-lg hover:drop-shadow-xl"
        >
            {children}
        </button>
    );
};

export default Button;
