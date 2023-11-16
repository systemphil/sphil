import { useCallback, useEffect, useState } from "react"
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent"

// declare global {
//     interface Window {
//         dataLayer: any[];
//     }
// }

const G_TAG_MNGR_ID = "g-tag-mngr";
const G_TAG_ID = "g-tag";

function removeGoogleAnalytics() {
    const scriptTagMngr = document.getElementById(G_TAG_MNGR_ID);
    if (scriptTagMngr) {
        document.head.removeChild(scriptTagMngr);
        console.log("removed ", scriptTagMngr)
    }
    const scriptTag = document.getElementById(G_TAG_ID);
    if (scriptTag) {
        document.head.removeChild(scriptTag);
        console.log("removed ", scriptTag)
    }
}

const Analytics = () => {
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
    const [hasConsentValue, setHasConsentValue] = useState<boolean>(false);

    const loadGoogleAnalytics = useCallback(() => {
        if (!GA_ID) return;
        setHasConsentValue(true);
        console.log("loading GA");
        const scriptTagMngr = document.createElement("script");
        scriptTagMngr.id = G_TAG_MNGR_ID;
        scriptTagMngr.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        scriptTagMngr.async = true;
        document.head.appendChild(scriptTagMngr);

        const scriptTag = document.createElement("script");
        scriptTag.id = G_TAG_ID;
        console.log("GA ID: ", GA_ID)
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

        // <Script id="google-analytics">
        //     {`
        //         window.dataLayer = window.dataLayer || [];
        //         function gtag(){dataLayer.push(arguments);}
        //         gtag('js', new Date());
        //         gtag('config', ${GA_ID})
        //     `}
        // </Script>

        // window.dataLayer = window.dataLayer || [];

        // const gtag: Gtag.Gtag = function () {
        //     window.dataLayer.push(arguments);
        // }
        // gtag("js", new Date());
        // gtag('config', 'G-MMKZQ2ZQ5G', {
        //     page_path: window.location.pathname,
        // } as any);
    
    // useEffect(() => {
    //     window.dataLayer = window.dataLayer || [];
    //     function gtag() { dataLayer.push(arguments); }

    //     gtag('js', new Date());
    //     gtag('config', 'G-MMKZQ2ZQ5G');

    //     const script = document.createElement('script');
    //     script.async = true;
    //     script.src = 'https://www.googletagmanager.com/gtag/js?id=G-MMKZQ2ZQ5G';
    //     script.onload = () => {
    //     window.gtag().set('sendPageView');
    //     };
    //     document.head.appendChild(script);
    // }, [])

    return(

        <>
            {!hasConsentValue && (
                <CookieConsent
                    enableDeclineButton
                    onAccept={loadGoogleAnalytics}
                    onDecline={() => {
                        setHasConsentValue(true);
                    }}
                    style={{ background: "#222", color: "white"}}
                    buttonStyle={{
                        color: "yellow",
                        background: "green",
                        fontSize: "18px",
                        borderRadius: "4px",
                    }}
                    declineButtonStyle={{
                        color: "red",
                        background: "gray",
                        fontSize: "18px",
                        borderRadius: "4px",
                    }}
                >
                    We has cookies. Make your choice.
                </CookieConsent>
            )}
        </>
    )
}

export default Analytics;
