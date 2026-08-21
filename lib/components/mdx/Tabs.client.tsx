"use client";

import cn from "clsx";
import GithubSlugger from "github-slugger";
import {
    Children,
    type CSSProperties,
    isValidElement,
    type ReactNode,
    useMemo,
    useState,
} from "react";

type TabsProps = {
    items: string[];
    defaultIndex?: number;
    children: ReactNode;
};

/**
 * Nextra slugged each tab label and injected a hidden heading so that
 * `#tab-label` deep links resolve. Reproduced here, including rendering every
 * panel so the anchors exist regardless of which tab is selected.
 */
const HIDDEN_HEADING: CSSProperties = {
    visibility: "hidden",
    width: 0,
    height: 0,
};

export function TabsRoot({ items, defaultIndex = 0, children }: TabsProps) {
    const [selected, setSelected] = useState(defaultIndex);
    const panels = Children.toArray(children).filter(isValidElement);

    const ids = useMemo(() => {
        const slugger = new GithubSlugger();
        return items.map((item) => slugger.slug(item));
    }, [items]);

    return (
        <div className="docs-tabs not-prose mt-4">
            <div
                role="tablist"
                className="flex w-max min-w-full gap-2 overflow-x-auto border-b docs-border pb-px"
            >
                {items.map((item, index) => (
                    <button
                        key={ids[index]}
                        type="button"
                        role="tab"
                        aria-selected={index === selected}
                        aria-controls={ids[index]}
                        onClick={() => setSelected(index)}
                        className={cn(
                            "mb-[-1px] cursor-pointer whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                            index === selected
                                ? "border-current text-current"
                                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        )}
                    >
                        {item}
                    </button>
                ))}
            </div>
            <div className="pt-4">
                {items.map((item, index) => (
                    <div key={ids[index]} hidden={index !== selected}>
                        <h3 id={ids[index]} style={HIDDEN_HEADING}>
                            {item}
                        </h3>
                        {panels[index]}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function Tab({ children }: { children?: ReactNode }) {
    return <div role="tabpanel">{children}</div>;
}
