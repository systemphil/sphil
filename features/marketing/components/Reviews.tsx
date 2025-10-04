"use client";

import Image from "next/image";
import ReviewsData from "../data/reviews.json";
import { useEffect, useState } from "react";
import { CardShell } from "lib/components/ui/CardShell";
import { Avatar, Button } from "@mui/material";

export function Reviews() {
    const [reviews, setReviews] = useState(ReviewsData.slice(0, 10));
    const [showButton, setShowButton] = useState(true);

    const handleShowMore = () => {
        setReviews((prevReviews) => [
            ...prevReviews,
            ...ReviewsData.slice(prevReviews.length, prevReviews.length + 10),
        ]);

        if (reviews.length >= ReviewsData.length) {
            setShowButton(false);
        }
    };

    useEffect(() => {
        if (ReviewsData.length < 11) {
            setShowButton(false);
        }
    }, []);

    return (
        <div
            className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 overflow-hidden relative transition-all py-10 sm:px-4`}
        >
            {showButton && (
                <div
                    className={`absolute bottom-0 left-0 z-10 w-full h-[400px] bg-linear-to-t from-white via-white`}
                />
            )}
            {reviews.map((review) => (
                <div
                    className="mb-4 z-0 break-inside-avoid-column"
                    key={review.url ?? review.name}
                >
                    <Review
                        name={review.name}
                        text={review.text}
                        imgUrl={review.img_url}
                        title={review.title}
                        url={review.url}
                    />
                </div>
            ))}
            {showButton && (
                <div className="absolute flex justify-center bottom-0 left-0 right-0 z-20 mb-10">
                    <Button onClick={() => handleShowMore()}>Show More</Button>
                </div>
            )}
        </div>
    );
}

function Review({
    name,
    text,
    url = undefined,
    title = undefined,
    imgUrl = "/static/images/avatar_placeholder.png",
}: {
    name: string;
    text: string;
    url?: string;
    title?: string;
    imgUrl?: string;
}) {
    return (
        <CardShell className="sm:w-72">
            <a href={url} target="_blank">
                <div className="flex gap-3 items-center">
                    <Avatar src={imgUrl}></Avatar>
                    <div className="relative">
                        <h3 className="text-xl font-semibold text-black dark:text-slate-200">
                            {name}
                        </h3>
                        <h3 className="absolute text-sm w-[200px] text-slate-400 -translate-y-2">
                            {title}
                        </h3>
                    </div>
                </div>
                <div className="text-slate-600/90 dark:text-slate-300 text-md mt-2">
                    &quot;{text}&quot;
                </div>
            </a>
        </CardShell>
    );
}
