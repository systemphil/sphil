"use client";

import { ThemeProvider } from "@mui/material";
import { useTheme as useNextraTheme } from "nextra-theme-docs";
import { useMemo, useState, useEffect } from "react";
import { darkTheme, lightTheme } from "./theme";

/**
 * ⚠️ Must be nested within Nextra layout since it depends on the light/dark mode from it.
 */
export function MuiThemeProvider({ children }: { children: React.ReactNode }) {
    const { theme, resolvedTheme } = useNextraTheme();
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
