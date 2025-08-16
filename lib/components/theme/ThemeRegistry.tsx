"use client";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";

export default function ThemeRegistry({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mode, setMode] = useState<"light" | "dark">("light");

    useEffect(() => {
        const loadTheme = () => {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme === "dark" || savedTheme === "light") {
                setMode(savedTheme);
            }
        };
        loadTheme();
        // FIXME theme is not sensitive to localStore changes
    }, []);

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode]
    );

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
