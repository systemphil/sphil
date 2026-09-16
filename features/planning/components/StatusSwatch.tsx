import { cn } from "lib/utils";
import type { PlanningItemColor, PlanningItemStatus } from "../types";
import { statusPaint } from "./planningStyles";

/** A small box showing an item's colour, filled in its status pattern. */
export function StatusSwatch({
    color,
    status,
    className,
}: {
    color: PlanningItemColor;
    status: PlanningItemStatus;
    className?: string;
}) {
    const paint = statusPaint({ color, status, stripe: 2 });

    return (
        <span
            aria-hidden
            className={cn(
                "inline-block size-3.5 shrink-0 rounded-[3px]",
                paint.className,
                className
            )}
            style={paint.style}
        />
    );
}
