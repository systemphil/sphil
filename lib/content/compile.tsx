import { run } from "@mdx-js/mdx";
import { cache } from "react";
import * as runtime from "react/jsx-runtime";
import { mdxComponents } from "lib/components/mdx/components";
import { readContentFile, resolveFile } from "./files";
import { compileArticle } from "./mdx";
import type { Frontmatter, TocEntry } from "./types";

export type Article = {
    frontmatter: Frontmatter;
    toc: TocEntry[];
    /** Path relative to `content/`, used by the edit-on-GitHub link. */
    filePath: string;
    /** The rendered MDX body. */
    // biome-ignore lint/suspicious/noExplicitAny: <React element produced by the MDX runtime>
    content: any;
};

/**
 * Syntax highlighting (shiki, via rehype-pretty-code) reads the current time,
 * which `cacheComponents` only permits inside a cache scope.
 */
async function compileCached(filePath: string, format: "md" | "mdx") {
    "use cache";
    return compileArticle(readContentFile(filePath), format, filePath);
}

/**
 * Reads, compiles and renders a content file. Everything happens at build
 * time: `app/articles/[[...mdxPath]]/page.tsx` prerenders every slug and sets
 * `dynamicParams = false`.
 */
export const loadArticle = cache(
    async (slug: string[]): Promise<Article | null> => {
        const file = resolveFile(slug);
        if (!file) return null;

        const { code, toc, frontmatter } = await compileCached(
            file.filePath,
            file.format
        );

        const { default: MDXContent } = await run(code, runtime);

        return {
            frontmatter,
            toc,
            filePath: file.filePath,
            content: <MDXContent components={mdxComponents} />,
        };
    }
);
