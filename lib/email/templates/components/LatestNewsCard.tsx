"use client";

import Link from "next/link";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { NEWSLETTERS } from "lib/email/data/newsletters";
import { CardShell } from "lib/components/ui/CardShell";

export function LatestNewsCard() {
    const latestNews = NEWSLETTERS[0];

    if (!latestNews) return null;

    return (
        <CardShell>
            <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-blue-600">
                    <ArticleOutlinedIcon fontSize="small" />
                    <Typography
                        variant="overline"
                        className="leading-none font-bold tracking-wider"
                    >
                        Latest Update
                    </Typography>
                </div>
                <Chip
                    label="New"
                    color="primary"
                    size="small"
                    className="!h-6 !text-xs font-semibold"
                />
            </div>

            <div>
                <Typography
                    variant="h6"
                    component="h3"
                    className="!font-bold !leading-tight mb-1"
                >
                    {latestNews.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {latestNews.subtitle}
                </Typography>
            </div>

            <div className="mt-2">
                <Button
                    component={Link}
                    href={`/newsletter/${latestNews.id}`}
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    size="small"
                    className="!normal-case !rounded-lg w-full sm:w-auto"
                >
                    Read Announcement
                </Button>
            </div>
        </CardShell>
    );
}
