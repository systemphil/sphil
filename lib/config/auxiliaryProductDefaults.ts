import { STRIPE_FALLBACKS } from "./stripeFallbacks";

/**
 * Auxiliary products used for additional purchases like seminar only upgrades etc.
 */
export const AUXILIARY_PRODUCTS_DEFAULTS = {
    seminarOnly: {
        productName: "sPhil Seminar Purchase",
        description: "Grants access to a seminar cohort",
        imageUrl: STRIPE_FALLBACKS.imageUrl,
        defaultPriceCents: 9990,
    },
    other: {
        productName: "sPhil Purchase",
        description:
            "The perfect product for you, your family and your friends",
        imageUrl: STRIPE_FALLBACKS.imageUrl,
        defaultPriceCents: 9990,
    },
};
