import { Cinzel, EB_Garamond } from "next/font/google";

export const cinzel = Cinzel({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-cinzel",
});

export const garamond = EB_Garamond({
    subsets: ["latin"],
    weight: ["400", "500"],
    style: ["normal", "italic"],
    variable: "--font-garamond",
});
