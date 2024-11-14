import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { actionVerifyUserPurchase } from "../server/actions";

export const useVerifyPurchase = ({
    purchasePriceId,
    slug,
}: {
    purchasePriceId: string;
    slug: string;
}) => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<string>("");

    const session = useSession();

    // Track number of retries
    const retryCount = useRef(0);
    const MAX_RETRIES = 10;
    const POLLING_INTERVAL = 2000; // 2 seconds

    // Track if the component is mounted
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const verifyPurchase = async () => {
            // Check if we have required data and haven't exceeded retry limit
            if (
                !session.data?.user?.id ||
                !purchasePriceId ||
                retryCount.current >= MAX_RETRIES
            ) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const result = await actionVerifyUserPurchase(
                    session.data.user.id,
                    purchasePriceId
                );

                if (!mounted.current) return;

                if (result) {
                    setSuccess(true);
                    setData(slug || "");
                    setLoading(false);
                } else {
                    // If verification unsuccessful, retry after delay
                    retryCount.current += 1;
                    if (retryCount.current < MAX_RETRIES) {
                        timeoutId = setTimeout(
                            verifyPurchase,
                            POLLING_INTERVAL
                        );
                    } else {
                        setError(true);
                        setLoading(false);
                    }
                }
            } catch (err) {
                if (!mounted.current) return;
                console.error("Purchase verification failed:", err);

                // Retry on error as well
                retryCount.current += 1;
                if (retryCount.current < MAX_RETRIES) {
                    timeoutId = setTimeout(verifyPurchase, POLLING_INTERVAL);
                } else {
                    setError(true);
                    setLoading(false);
                }
            }
        };

        // Start verification process if we have required data
        if (session.data?.user?.id && purchasePriceId) {
            verifyPurchase();
        } else if (session.status !== "loading") {
            // If session is not loading and we don't have required data, set error
            setError(true);
            setLoading(false);
        }

        // Cleanup timeout on unmount or deps change
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [session.data?.user?.id, session.status, purchasePriceId, slug]);

    return { success, error, loading, data };
};
