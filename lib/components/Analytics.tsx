"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
import { usePostHog } from "posthog-js/react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import Link from "next/link";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY as string;

export function Analytics({ children }: { children: React.ReactNode }) {
    if (!POSTHOG_KEY) {
        return <>{children}</>;
    }

    return <PostHogProviderInternal>{children}</PostHogProviderInternal>;
}

function cookieConsentGiven() {
    const cookie = getCookieConsentValue();
    if (!cookie) {
        return "undecided";
    }
    return Boolean(cookie);
}

function PostHogProviderInternal({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        posthog.init(POSTHOG_KEY, {
            api_host: "https://eu.i.posthog.com",
            person_profiles: "identified_only",
            persistence:
                cookieConsentGiven() === true
                    ? "localStorage+cookie"
                    : "memory",
            capture_pageview: false,
        });
    }, []);

    return (
        <PHProvider client={posthog}>
            <SuspendedPostHogPageView />
            {children}
            <CookieBanner />
        </PHProvider>
    );
}

function CookieBanner() {
    const [consentGiven, setConsentGiven] = useState<
        true | false | "undecided" | ""
    >("");
    const posthog = usePostHog();

    useEffect(() => {
        setConsentGiven(cookieConsentGiven());
    }, []);

    useEffect(() => {
        if (consentGiven !== "") {
            posthog.set_config({
                persistence:
                    consentGiven === true ? "localStorage+cookie" : "memory",
            });
        }
    }, [consentGiven, posthog]);

    const handleAcceptCookies = () => {
        setConsentGiven(true);
    };

    const handleDeclineCookies = () => {
        setConsentGiven(false);
    };

    if (consentGiven === "undecided") {
        return (
            <CookieConsent
                enableDeclineButton
                onAccept={handleAcceptCookies}
                onDecline={handleDeclineCookies}
                style={{ background: "#111111", color: "white" }}
                buttonStyle={{
                    backgroundColor: "hsl(155, 100%, 66%, 0.17)",
                    color: "#FFFFFF",
                    fontSize: "18px",
                    borderRadius: "4px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    transition: "background-color 0.3s, box-shadow 0.3s",
                }}
                declineButtonStyle={{
                    backgroundColor: "hsl(13, 13%, 27%)",
                    color: "#FFFFFF",
                    fontSize: "18px",
                    borderRadius: "4px",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
                    transition: "background-color 0.3s, box-shadow 0.3s",
                }}
            >
                This site uses cookies to analyze traffic for marketing purposes
                and to improve your experience. To learn more, visit our{" "}
                <Link
                    href="/articles/privacy"
                    className="text-blue-400 underline hover:text-blue-300"
                >
                    Privacy Policy
                </Link>
                .{" "}
            </CookieConsent>
        );
    }

    return null;
}

function PostHogPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const posthog = usePostHog();

    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname;
            if (searchParams.toString()) {
                url = `${url}?${searchParams.toString()}`;
            }

            posthog.capture("$pageview", { $current_url: url });
        }
    }, [pathname, searchParams, posthog]);

    return null;
}

function SuspendedPostHogPageView() {
    return (
        <Suspense fallback={null}>
            <PostHogPageView />
        </Suspense>
    );
}
