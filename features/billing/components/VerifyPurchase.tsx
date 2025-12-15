"use client";

import { Heading } from "lib/components/ui/Heading";
import { useVerifyPurchase } from "../hooks/useVerifyPurchase";
import Link from "lib/components/navigation/ClientNextLink";
import { Alert, AlertTitle, Button } from "@mui/material";
import { Loading } from "lib/components/animations/Loading";

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

    return (
        <div className="mt-4">
            <Heading>Confirming Purchase</Heading>
            <div className="pt-4">
                {loading && (
                    <Alert severity="info">
                        <AlertTitle>Loading</AlertTitle>
                        <span>
                            Please wait while your purchase is being
                            confirmed...
                        </span>
                        <Loading.RingLg />
                    </Alert>
                )}
                {error && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
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
                    </Alert>
                )}
                {!loading && success && (
                    <>
                        <Alert severity="success">
                            <AlertTitle>Success</AlertTitle>
                            <span>
                                Thank you for your purchase! 🙏 The course has
                                been added to{" "}
                                <Link href="/my-courses" className="underline">
                                    My courses
                                </Link>{" "}
                                or go directly via the button below.
                            </span>
                        </Alert>
                        <div className="flex justify-center m-10">
                            <Button
                                variant="contained"
                                LinkComponent={Link}
                                href={`/courses/${data}`}
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
