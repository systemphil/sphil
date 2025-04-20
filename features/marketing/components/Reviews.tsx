"use client";

import Image from "next/image";
import ReviewsData from "../data/reviews.json";
import { useEffect, useState } from "react";
import { CardShell } from "lib/components/ui/CardShell";

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
            {reviews.map((review: any, i: number) => (
                <div className="mb-4 z-0 break-inside-avoid-column" key={i}>
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
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleShowMore()}
                    >
                        Show More
                    </button>
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
    url?: string | undefined;
    title?: string | undefined;
    imgUrl?: string;
}) {
    return (
        <CardShell className="sm:w-72">
            <div className="d-card-body">
                <a href={url ? url : undefined} target="_blank">
                    <div className="flex gap-3 items-center">
                        <div className="d-avatar">
                            <div className="w-12 rounded-full">
                                <Image
                                    src={imgUrl}
                                    width={96}
                                    height={96}
                                    alt="review avatar"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <h3 className="text-xl font-semibold">{name}</h3>
                            <h3 className="absolute text-sm w-[200px] text-slate-400 -translate-y-2">
                                {title}
                            </h3>
                        </div>
                    </div>
                    <div className="text-slate-600/90 dark:text-slate-300 text-md mt-2">
                        &quot;{text}&quot;
                    </div>
                </a>
            </div>
        </CardShell>
    );
}
