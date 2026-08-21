import type { ComponentProps } from "react";
import { Tab, TabsRoot } from "./Tabs.client";

/**
 * Ported from `nextra/components` (MIT). Keeps the compound `Tabs.Tab` API —
 * the compound object has to be assembled outside the `"use client"` module,
 * otherwise `Tabs.Tab` resolves to `undefined` across the RSC boundary.
 */
export const Tabs = Object.assign(
    (props: ComponentProps<typeof TabsRoot>) => <TabsRoot {...props} />,
    { displayName: "Tabs", Tab }
);
