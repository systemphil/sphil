import { useCallback, useEffect, useState } from "react"
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent"

const G_TAG_MNGR_ID = "g-tag-mngr";
const G_TAG_ID = "g-tag";

function removeGoogleAnalytics() {
    const scriptTagMngr = document.getElementById(G_TAG_MNGR_ID);
    if (scriptTagMngr) {
        document.head.removeChild(scriptTagMngr);
    }
    const scriptTag = document.getElementById(G_TAG_ID);
    if (scriptTag) {
        document.head.removeChild(scriptTag);
    }
}

const Analytics = () => {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
    console.log(GA_ID) // TODO remove
    const [hasConsentValue, setHasConsentValue] = useState<boolean>(false);

    const loadGoogleAnalytics = useCallback(() => {
        if (!GA_ID) return;
        setHasConsentValue(true);
        const scriptTagMngr = document.createElement("script");
        scriptTagMngr.id = G_TAG_MNGR_ID;
        scriptTagMngr.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        scriptTagMngr.async = true;
        document.head.appendChild(scriptTagMngr);

        const scriptTag = document.createElement("script");
        scriptTag.id = G_TAG_ID;
        scriptTag.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}')
        `;
        document.head.appendChild(scriptTag);
    }, [GA_ID])

    useEffect(() => {
        setHasConsentValue(!!getCookieConsentValue());
        if (getCookieConsentValue() === "true") {
            loadGoogleAnalytics();
        }
        return () => {
            removeGoogleAnalytics();
        }
    }, [loadGoogleAnalytics]);

    // TODO fix banner UI
    return(
        <>
            {!hasConsentValue && (
                <CookieConsent
                    enableDeclineButton
                    onAccept={loadGoogleAnalytics}
                    onDecline={() => {
                        setHasConsentValue(true);
                    }}
                    style={{ background: "#111111", color: "white"}}
                    
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
                    This site uses cookies to analyze traffic for marketing purposes and to improve your experience. To learn more, visit our <a href="/privacy" className="text-blue-400 underline hover:text-blue-300">Privary Policy</a>.{" "}
                </CookieConsent>
            )}
        </>
    )
}

export default Analytics;
