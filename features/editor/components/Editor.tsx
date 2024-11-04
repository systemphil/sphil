"use client";

import dynamic from "next/dynamic";
import { EditorProps } from "./EditorInternals";

const EditorComponent = dynamic(() => import("./EditorInternals"), {
    ssr: false,
});

export default function Editor({ initialMaterial, title }: EditorProps) {
    return <EditorComponent initialMaterial={initialMaterial} title={title} />;
}
