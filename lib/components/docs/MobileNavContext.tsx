"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type MobileNavValue = {
    isOpen: boolean;
    toggle: () => void;
    close: () => void;
};

const MobileNavContext = createContext<MobileNavValue>({
    isOpen: false,
    toggle: () => {},
    close: () => {},
});

/**
 * Shares the mobile navigation drawer state between the navbar (root layout)
 * and the docs sidebar (articles layout), which live in sibling subtrees.
 */
export function MobileNavProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <Close the drawer on navigation>
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", isOpen);
        return () => document.body.classList.remove("overflow-hidden");
    }, [isOpen]);

    const value = useMemo(
        () => ({
            isOpen,
            toggle: () => setIsOpen((open) => !open),
            close: () => setIsOpen(false),
        }),
        [isOpen]
    );

    return (
        <MobileNavContext.Provider value={value}>
            {children}
        </MobileNavContext.Provider>
    );
}

export const useMobileNav = () => useContext(MobileNavContext);
