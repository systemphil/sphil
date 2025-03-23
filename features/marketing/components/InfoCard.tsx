import { CardShell } from "lib/components/ui/CardShell";
import { Heading } from "lib/components/ui/Heading";
import { cn } from "lib/utils";
import Image from "next/image";
import Link from "next/link";

type InfoCardProps = {
    title: string;
    text: string;
    maskType?: "diamond" | "triangle" | "squircle";
    imgUrl?: string;
    urlDescription?: string;
    url?: string;
};

export async function InfoCard({
    title,
    text,
    maskType,
    imgUrl,
    urlDescription,
    url,
}: InfoCardProps) {
    return (
        <CardShell>
            {imgUrl && (
                <figure className="mt-4">
                    <Image
                        className={cn(
                            "custom-mask",
                            maskType === "diamond" && "custom-mask-diamond",
                            maskType === "triangle" && "custom-mask-triangle",
                            maskType === "squircle" && "custom-mask-squircle"
                        )}
                        src={imgUrl}
                        alt="Movie"
                        width={200}
                        height={200}
                    />
                </figure>
            )}
            <div className="d-card-body">
                <div className="d-card-title justify-center">
                    <Heading as="h4">{title}</Heading>
                </div>
                <p className="text-slate-700 dark:text-slate-300 pt-4 text-justify sm:text-lg">
                    {text}
                </p>
                {url && urlDescription && (
                    <div className="d-card-actions justify-end">
                        <Link href={url}>
                            <button className="d-btn d-btn-primary">
                                {urlDescription}
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </CardShell>
    );
}
