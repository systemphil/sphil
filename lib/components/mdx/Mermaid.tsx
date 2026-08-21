"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Renders a mermaid code fence client-side. Ported from
 * `@theguild/remark-mermaid` (MIT), which Nextra used internally. `mermaid`
 * is imported lazily so it only ships to pages that contain a diagram, and
 * only once the diagram scrolls into view.
 */
export function Mermaid({ chart }: { chart: string }) {
    const id = useId();
    const [svg, setSvg] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                observer.disconnect();
                setIsVisible(true);
            }
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const htmlElement = document.documentElement;

        async function renderChart() {
            const isDarkTheme =
                htmlElement.classList.contains("dark") ||
                htmlElement.getAttribute("data-theme") === "dark";
            const { default: mermaid } = await import("mermaid");
            try {
                mermaid.initialize({
                    startOnLoad: false,
                    securityLevel: "loose",
                    fontFamily: "inherit",
                    themeCSS: "margin: 1.5rem auto 0;",
                    theme: isDarkTheme ? "dark" : "default",
                });
                const { svg: rendered } = await mermaid.render(
                    // Strip characters that are invalid in an `id` attribute.
                    id.replaceAll(":", ""),
                    chart.replaceAll("\\n", "\n")
                );
                setSvg(rendered);
            } catch (error) {
                console.error("Error while rendering mermaid", error);
            }
        }

        const observer = new MutationObserver(() => {
            void renderChart();
        });
        observer.observe(htmlElement, { attributes: true });
        void renderChart();

        return () => observer.disconnect();
    }, [chart, isVisible, id]);

    return (
        <div
            ref={containerRef}
            // biome-ignore lint/security/noDangerouslySetInnerHtml: <SVG produced by mermaid from repo-owned content>
            dangerouslySetInnerHTML={{ __html: svg }}
        />
    );
}
