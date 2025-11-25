export default {
    /**
     * Hack to work around Nextra's routing system.
     * We show a fake item for the courses link while
     * disabling the actual courses.
     *
     * It's important to put articles above courses,
     * otherwise we get a weird crash.
     */
    _courses: {
        title: "Courses 🏺",
        type: "page",
        href: "/courses",
    },
    articles: {
        title: "Encyclopaedia",
        type: "page",
        display: "children",
    },
    _newsletter: {
        title: "News",
        type: "page",
        href: "/newsletter",
    },
    courses: {
        display: "hidden",
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
    team: {
        display: "hidden",
    },
    newsletter: {
        display: "hidden",
    },
    test: {
        display: "hidden",
    },
};
