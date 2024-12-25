export default {
    articles: {
        title: "‎", // Invisible character, this won't display on navbar
        type: "page",
        display: "children",
    },

    symposia: {
        title: "Symposia 🏺",
        type: "menu",
        items: {
            about: {
                href: "/symposia",
            },
            courses: {
                href: "/symposia/courses",
            },
        },
    },
    contributing: {
        title: "Contributing",
        type: "page",
        href: "/articles/contributing",
    },
    billing: {
        display: "hidden",
    },
    index: {
        display: "hidden",
    },
    "purchase-success": {
        display: "hidden",
    },
    admin: {
        display: "hidden",
    },
};
