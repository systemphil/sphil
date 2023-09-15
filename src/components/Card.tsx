import styles from "./card.module.css";
import cn from "classnames";

/**
 * In order for Card to animate the pseudo-background, it must access certain CSS properties exposed via the Houdini API.
 * Therefore, a special CSS class "card-magic" was made to achieve this. This class only does the fancy animation
 * styling, leaving the rest, such as size and background, to be handled by Tailwind as per usual.
 * @See {@Link https://developer.mozilla.org/en-US/docs/Web/Guide/Houdini CSS Houdini }
 */
const Card = () => {
    return <div className={cn(styles["card-magic"], "h-[60vh] aspect-[1/1.25] card-magic bg-slate-400 rounded-md")}></div>
}
export default Card;