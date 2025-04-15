import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Link from "next/link";

export function Back({ href, text = "Back" }: { href: string; text?: string }) {
    return (
        <Link
            href={href}
            className="text-base text-primary dark:text-gray-300 opacity-70 transition hover:opacity-100 p-2 flex items-center justify-center"
        >
            <ArrowBackOutlinedIcon fontSize="small" />
            {text}
        </Link>
    );
}
