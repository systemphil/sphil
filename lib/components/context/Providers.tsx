"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Analytics } from "../Analytics";
import ThemeRegistry from "../theme/ThemeRegistry";

export const Providers = ({ children }) => {
    return (
        <SessionProvider>
            <ThemeRegistry>
                <Analytics>
                    {children}
                    <Toaster position="bottom-right" />
                </Analytics>
            </ThemeRegistry>
        </SessionProvider>
    );
};
