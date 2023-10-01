import Link from "next/link"
import CardShell from "./CardShell"
import Button from "./Button"

type Buttons = {
    title: string
    href: string
}
const CardFancy = ({
    title,
    tagline,
    href,
    buttons,
}: {
    title: string,
    tagline: string,
    href: string,
    buttons: Buttons[]
}) => {

    return(
        <CardShell>
            <Link href={href}>
                <p className="text-5xl font-bold text-center hover:text-slate-600 duration-300">{title}</p>
                <p className="w-[300px] text-center mt-2 text-lg text-stone-500">{tagline}</p>
            </Link>
            <div className="flex gap-4 mt-2">
                {buttons.map((button, index) => {return(
                    <Link key={index} href={button.href}>
                        <Button>{button.title}</Button>
                    </Link>
                )})}
            </div>
        </CardShell>
    );
}

export default CardFancy;