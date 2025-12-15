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
            if (!purchasePriceId || retryCount.current >= MAX_RETRIES) {
                setError(true);
                setLoading(false);
                return;
            }

            try {
                const result = await actionVerifyUserPurchase({
                    purchasePriceId,
                });

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
        if (purchasePriceId) {
            verifyPurchase();
        }

        // Cleanup timeout on unmount or deps change
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [purchasePriceId, slug]);

    return { success, error, loading, data };
};
