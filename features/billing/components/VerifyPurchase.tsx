"use client";

import { Heading } from "lib/components/ui/Heading";
import { useVerifyPurchase } from "../hooks/useVerifyPurchase";
import Link from "next/link";
import { Button } from "@mui/material";

export const VerifyPurchase = ({
    purchasePriceId,
    slug,
}: {
    purchasePriceId: string;
    slug: string;
}) => {
    const { loading, success, data, error } = useVerifyPurchase({
        purchasePriceId,
        slug,
    });
    const commonAlertClasses = "md:min-w-[600px]";

    return (
        <div className="mt-4">
            <Heading>Confirming Purchase</Heading>
            <div className="pt-4">
                {loading && (
                    <div
                        role="alert"
                        className={`d-alert d-alert-info md:min-w-[600px] ${commonAlertClasses}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            className="stroke-current shrink-0 w-6 h-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <span>
                            Please wait while your purchase is being
                            confirmed...
                        </span>
                        <span className="d-loading d-loading-dots d-loading-md"></span>
                    </div>
                )}
                {error && (
                    <div
                        role="alert"
                        className={`d-alert d-alert-error ${commonAlertClasses}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>
                            There was an error in confirming your purchase. 😖
                            Please contact support{" "}
                            <a
                                href="mailto:support@systemphil.com"
                                className="text-blue-500 underline hover:text-blue-700 font-bold"
                            >
                                at this email
                            </a>
                            .
                        </span>
                    </div>
                )}
                {!loading && success && (
                    <>
                        <div
                            role="alert"
                            className={`d-alert d-alert-success ${commonAlertClasses}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>Thank you for your purchase! 🙏</span>
                        </div>
                        <div className="flex justify-center m-10">
                            <Button
                                variant="contained"
                                LinkComponent={Link}
                                href={`/symposia/courses/${data}`}
                            >
                                Click to go to the course
                            </Button>
                        </div>
                        <div className="flex justify-center">
                            <p className="mt-12 text-gray-500 dark:text-gray-300 max-w-md">
                                A receipt has been sent to the email address
                                attached to the account in which the purchase
                                was made.
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
