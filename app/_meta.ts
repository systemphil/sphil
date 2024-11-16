export default {
    articles: {
        title: "Contributing", // For main navbar display, this route will go directly to contributing index
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
