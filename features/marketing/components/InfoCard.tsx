import { CardShell } from "lib/components/ui/CardShell";
import { Heading } from "lib/components/ui/Heading";
import { cn } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Button, Box, Typography } from "@mui/material";
import { JSX } from "react";

type InfoCardProps = {
    title: string;
    text: string | JSX.Element;
    maskType?: "diamond" | "triangle" | "squircle";
    imgUrl?: string;
    urlDescription?: string;
    url?: string;
    headingSize?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export async function InfoCard({
    title,
    text,
    maskType,
    imgUrl,
    urlDescription,
    url,
    headingSize = "h5",
}: InfoCardProps) {
    return (
        <CardShell>
            <Box display="flex" alignItems="center" justifyContent="center">
                {imgUrl && (
                    <figure className="mt-4">
                        <Image
                            className={cn(
                                "custom-mask",
                                maskType === "diamond" && "custom-mask-diamond",
                                maskType === "triangle" &&
                                    "custom-mask-triangle",
                                maskType === "squircle" &&
                                    "custom-mask-squircle"
                            )}
                            src={imgUrl}
                            alt="Movie"
                            width={200}
                            height={200}
                        />
                    </figure>
                )}
            </Box>
            <Box p={2}>
                <div className="justify-center">
                    <Heading as={headingSize}>{title}</Heading>
                </div>
                <Typography className="text-slate-700 dark:text-slate-300 pt-4 text-justify sm:text-lg">
                    {text}
                </Typography>
                {url && urlDescription && (
                    <div className="justify-end">
                        <Link href={url}>
                            <Button variant="contained">
                                {urlDescription}
                            </Button>
                        </Link>
                    </div>
                )}
            </Box>
        </CardShell>
    );
}
