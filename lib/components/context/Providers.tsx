"use client";

import { SessionProvider } from "next-auth/react";
import { Analytics } from "../Analytics";
import { Toaster } from "react-hot-toast";

export const Providers = ({ children }) => {
    return (
        <SessionProvider>
            {children}
            <Analytics />
            <Toaster position="bottom-right" />
        </SessionProvider>
    );
};
