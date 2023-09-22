import { ReactNode } from "react";
import styles from "./card.module.css";
import cn from "classnames";

/**
 * In order for Card to animate the pseudo-background, it must access certain CSS properties exposed via the Houdini API, 
 * which is not available(?) in TailwindCSS.
 * Therefore, a special CSS class "card-magic" was made to achieve this. This class only does the fancy animation
 * styling, leaving the rest, such as size and background, to be handled by Tailwind as per usual.
 * @See {@Link https://developer.mozilla.org/en-US/docs/Web/Guide/Houdini CSS Houdini}
 */
const Card = ({ children }: {children?: ReactNode}) => {
    return (
        <div className={cn(styles["card-magic"], "h-[35vh] aspect-[4/3] card-magic bg-slate-400 rounded-md flex flex-col items-center justify-center")}>
            {children}
        </div>
    );
}
export default Card;