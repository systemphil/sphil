import type { ComponentProps } from "react";
import { File, Folder, Tree } from "./FileTree.client";

/**
 * Ported from `nextra/components` (MIT). The compound object is assembled
 * here, outside the `"use client"` module, so that `FileTree.File` and
 * `FileTree.Folder` resolve across the RSC boundary.
 */
export const FileTree = Object.assign(
    (props: ComponentProps<typeof Tree>) => <Tree {...props} />,
    { displayName: "FileTree", Folder, File }
);
