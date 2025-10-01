"use client";

import { Theme, createTheme, darkScrollbar } from "@mui/material";
import { red } from "@mui/material/colors";

const baseTheme: Theme = createTheme({
    typography: {
        fontFamily: "ui-sans-serif, system-ui, sans-serif, ",
        body1: {
            fontSize: "1.125rem",
            lineHeight: 1.6,
        },
    },
});

export const lightTheme = createTheme(
    baseTheme,
    createTheme(baseTheme, {
        palette: {
            mode: "light",
            primary: {
                main: "#6b0072",
                light: "#9d3e9f",
                dark: "#52005a",
                contrastText: "#ffffff",
            },
            secondary: {
                main: "#1976d2",
                light: "#42a5f5",
                dark: "#1565c0",
                contrastText: "#ffffff",
            },
            text: {
                primary: "#ffffff",
                secondary: "rgba(255, 255, 255, 0.7)",
            },
        },
    })
);

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
                dark: "#047857",
                contrastText: "#ffffff",
            },
            secondary: {
                main: "#42a5f5",
                light: "#71bbf7",
                dark: "#1976d2",
                contrastText: "#000000",
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
