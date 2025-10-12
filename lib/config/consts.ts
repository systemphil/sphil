export const EDIT_LINK_DESCRIPTION = "Edit this page on GitHub";
export const PROJECT_LINK = "https://github.com/systemphil/sphil";
export const DOCS_REPOSITORY_BASE =
    "https://github.com/systemphil/sphil/tree/main";
export const SITE_ROOT = process.env.NEXT_PUBLIC_SITE_ROOT as string;
export const COLOR = {
    hue: {
        dark: 155,
        light: 215,
    },
    saturation: {
        dark: 90,
        light: 90,
    },
};

export const TITLE = "sPhil - Study the Great Texts";
export const DESCRIPTION =
    "Explore and study humanity's greatest texts across philosophy and literature. Deep dive into works by Hegel, Aristotle, Schelling, Milton and other influential thinkers and writers.";

export const OG_IMAGES = [
    {
        url: `${SITE_ROOT}/images/og-image-sphil.avif`,
        width: 1200,
        height: 630,
        alt: TITLE,
        type: "image/avif",
    },
    {
        url: `${SITE_ROOT}/images/og-image-sphil.webp`,
        width: 1200,
        height: 630,
        alt: TITLE,
        type: "image/webp",
    },
    {
        url: `${SITE_ROOT}/images/og-image-sphil.png`,
        width: 1200,
        height: 630,
        alt: TITLE,
        type: "image/png",
    },
];
