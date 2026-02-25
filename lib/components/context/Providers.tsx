"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Analytics } from "../Analytics";
import { RewardfulTracker } from "../RewardfulTracker";

export const Providers = ({ children }) => {
    return (
        <SessionProvider>
            <Analytics>
                {children}
                <Toaster position="bottom-right" />
                <RewardfulTracker />
            </Analytics>
        </SessionProvider>
    );
};
