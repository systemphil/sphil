"use client";

import { Theme, createTheme, darkScrollbar } from "@mui/material";
import { red } from "@mui/material/colors";

const baseTheme: Theme = createTheme({
    typography: {
        fontFamily: "var(--font-roboto)",
    },
});

export const lightTheme = baseTheme;

export const darkTheme = createTheme(
    baseTheme,
    createTheme(baseTheme, {
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    html: { ...darkScrollbar },
                },
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundColor: "#1d1d1d",
                    },
                },
            },
        },
        palette: {
            mode: "dark",
            primary: {
                main: "rgba(82, 255, 183, 0.17)",
                light: "#047857",
                dark: "#047857", // Active state
                contrastText: "#ffffff",
            },
            secondary: {
                main: red[300],
            },
            background: {
                default: "#121212",
                paper: "#1d1d1d",
            },
            text: {
                primary: "#ffffff",
                secondary: "rgba(255, 255, 255, 0.7)",
            },
        },
    })
);
