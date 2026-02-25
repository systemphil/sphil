"use client";

import { useEffect } from "react";

declare global {
    interface Window {
        rewardful?: (event: string, callback: () => void) => void;
    }

    var Rewardful: {
        referral?: string;
        coupon?: string;
        source?: string;
    };
}

export function RewardfulTracker() {
    useEffect(() => {
        if (document.cookie.includes("rwl_referral=")) return;

        window.rewardful?.("ready", () => {
            if (!Rewardful.referral) return;

            const payload = JSON.stringify({
                referralId: Rewardful.referral,
                couponId: Rewardful.coupon ?? null,
                source: Rewardful.source ?? null,
                referredAt: new Date().toISOString(),
            });

            // biome-ignore lint/suspicious/noDocumentCookie: <Using typical recommendations>
            document.cookie = `rwl_referral=${encodeURIComponent(payload)}; path=/; max-age=${90 * 24 * 60 * 60}; SameSite=Lax`;
        });
    }, []);

    return null;
}
