function Separator({ children }: { children: React.ReactNode }) {
    return <div className="flex items-center gap-2">{children}</div>;
}

export default {
    "*": {
        theme: {
            breadcrumb: false,
            pagination: false,
        },
    },
    index: {
        title: "Contributing",
    },
    "code-of-conduct": {
        title: "Code of Conduct",
    },
    "--- Philosophy": {
        type: "separator",
        title: <Separator>Philosophy</Separator>,
    },
    methodology: "",
    "--- Code": {
        type: "separator",
        title: <Separator>Code</Separator>,
    },
    "why-these-tools": "",
    github: "",
    formatting: "",
    "local-development": "",
};
