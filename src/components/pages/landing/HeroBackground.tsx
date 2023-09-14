"use client";

import { useEffect, useState } from "react";
import Stars from "./Stars";


const HeroBackground = () => {
    // We must use typeof window !== "undefined" to avoid crashing the Nextjs server during development. 
    const [theme, setTheme] = useState(typeof window !== "undefined" ? localStorage.theme :  "light");

    useEffect(() => {
        /**
         * No arguments needed as the checker will itself check for the relevant property
         * and mutate state as required.
         */
        const DOMTokenListChecker = () => {
            if (document.documentElement.classList.contains("dark")) {
                setTheme("dark"); 
            } else {
                setTheme("light");
            }
        };
        /**
         * Get the root document node since that is where the relevant properties we need
         * to check if darkmode is on are kept.
         */
        const targetObservable = document.documentElement;
        const config = { 
            attributes: true, 
            attributeFilter: ["class"]
        };
        /**
         * For the callback function we check whether there is a change in the relevant type and attributeName.
         * We then call the checker but do not need to pass it any values.
         */
        const callback: MutationCallback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type === "attributes" && mutation.attributeName === "class") {
                    DOMTokenListChecker();
                }
            }
        };
        /**
         * Instantiate new MutationObserver object and call its observe method.
         */
        const observer = new MutationObserver(callback);
        observer.observe(targetObservable, config);
        return () => {
            /**
             * When component unmounts, disconnect the observer.
             */
            observer.disconnect();
        };
    }, [theme])

    return(
        <Stars theme={theme}/>
    )
}

export default HeroBackground;