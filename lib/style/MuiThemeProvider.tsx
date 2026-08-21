"use client";

import { ThemeProvider } from "@mui/material";
import { useTheme } from "next-themes";
import { useMemo, useState, useEffect } from "react";
import { darkTheme, lightTheme } from "./theme";

/**
 * ⚠️ Must be nested within the `next-themes` provider in the root layout,
 * since it mirrors its light/dark mode into MUI.
 */
export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
        setMounted(true);
    }, []);

    const actualTheme = useMemo(() => {
        const activeTheme = resolvedTheme || theme;
        return activeTheme === "dark" ? darkTheme : lightTheme;
    }, [theme, resolvedTheme]);

    // Don't render ThemeProvider until client-side mounted
    // This prevents server/client mismatch
    if (!mounted) {
        // Return children without theme provider during SSR
        return <>{children}</>;
    }

    return <ThemeProvider theme={actualTheme}>{children}</ThemeProvider>;
}
