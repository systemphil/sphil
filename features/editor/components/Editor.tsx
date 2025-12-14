"use client";

import dynamic from "next/dynamic";
import type { EditorProps } from "./EditorInternals";

const EditorComponent = dynamic(() => import("./EditorInternals"), {
    ssr: false,
});

export default function Editor(props: EditorProps) {
    return <EditorComponent {...props} />;
}
