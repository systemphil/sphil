"use client";

import {
    Avatar,
    Button,
    FormControlLabel,
    IconButton,
    MenuItem,
    Stack,
    Switch,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    type TooltipProps,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
    type PointerEvent as ReactPointerEvent,
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import toast from "react-hot-toast";
import { cn } from "lib/utils";
import { actionUpdatePlanningItem } from "../server/actions";
import type { PlanningAssignee, PlanningItem } from "../types";
import {
    formatDay,
    fromDayNum,
    toDayNum,
    todayDayNum,
} from "../utils/days";
import { comparePlanningItems } from "../utils/order";
import { buildScale, ZOOMS, type Zoom, zoomLabel } from "../utils/scale";
import { type DrawerState, PlanningItemDrawer } from "./PlanningItemDrawer";
import { StatusSwatch } from "./StatusSwatch";
import {
    COLOR_SWATCH_CLASSES,
    NO_SCROLL_LOCK_SELECT,
    STATUS_META,
    statusPaint,
} from "./planningStyles";

const LEFT_WIDTH = 260;
const ROW_HEIGHT = 44;
const HEADER_TIER_HEIGHT = 26;
/** Pointer travel (px) before a press on a bar counts as a drag, not a click. */
const DRAG_THRESHOLD = 3;
const NEW_ITEM_DAYS = 14;
/** Items that ended more than this many days ago are hidden unless shown. */
const PAST_GRACE_DAYS = 1;

/** Assignee filter values besides a user id. */
const ALL_ASSIGNEES = "__all";
const UNASSIGNED = "__unassigned";

type DragMode = "move" | "start" | "end";

type Drag = {
    id: string;
    mode: DragMode;
    originX: number;
    originStart: number;
    originEnd: number;
    start: number;
    end: number;
    moved: boolean;
};

function initials(assignee: PlanningAssignee) {
    const source = assignee.name ?? assignee.email;
    return source
        .split(/[\s@.]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

/** Bars narrower than this (px) drop the avatar so the title keeps room. */
const BAR_AVATAR_MIN_WIDTH = 56;

function AssigneeAvatar({
    assignee,
    size,
    className,
}: {
    assignee: PlanningAssignee;
    size: number;
    className?: string;
}) {
    return (
        <Avatar
            src={assignee.image ?? undefined}
            alt={assignee.name ?? assignee.email}
            className={className}
            // Stops the browser's native image drag from hijacking a bar drag.
            slotProps={{ img: { draggable: false } }}
            sx={{ width: size, height: size, fontSize: size * 0.45 }}
        >
            {initials(assignee)}
        </Avatar>
    );
}

function BarTooltip({
    item,
    start,
    end,
    assignee,
}: {
    item: PlanningItem;
    start: number;
    end: number;
    assignee: PlanningAssignee | undefined;
}) {
    const status = STATUS_META[item.status];
    const days = end - start + 1;
    const description = item.description.trim();

    return (
        <div className="w-72">
            <div className={cn("h-1", COLOR_SWATCH_CLASSES[item.color])} />
            <div className="flex flex-col gap-2.5 p-3">
                <div className="flex items-start justify-between gap-3">
                    <span className="text-sm font-semibold leading-snug">
                        {item.title}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-neutral-600 dark:text-neutral-300">
                        <StatusSwatch color={item.color} status={item.status} />
                        {status.label}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                    <span>
                        {formatDay(start, { month: "short", day: "numeric" })}
                        {" – "}
                        {formatDay(end, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                    <span aria-hidden>·</span>
                    <span>
                        {days} {days === 1 ? "day" : "days"}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    {assignee ? (
                        <>
                            <AssigneeAvatar assignee={assignee} size={20} />
                            <span>{assignee.name ?? assignee.email}</span>
                        </>
                    ) : (
                        <span className="italic text-neutral-500 dark:text-neutral-400">
                            Unassigned
                        </span>
                    )}
                </div>
                {description && (
                    <p className="border-t border-neutral-200 dark:border-neutral-700 pt-2.5 text-xs leading-relaxed whitespace-pre-line line-clamp-6 text-neutral-700 dark:text-neutral-300">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}

/** Turns MUI's small dark label into a card that matches the page theme. */
const BAR_TOOLTIP_SLOT_PROPS: TooltipProps["slotProps"] = {
    tooltip: {
        sx: {
            p: 0,
            maxWidth: "none",
            overflow: "hidden",
            borderRadius: 2,
            bgcolor: "background.paper",
            color: "text.primary",
            border: 1,
            borderColor: "divider",
            boxShadow: "0 12px 32px -12px rgba(0, 0, 0, 0.35)",
        },
    },
    popper: {
        modifiers: [{ name: "offset", options: { offset: [0, -4] } }],
    },
};

export function PlanningTimeline({
    items: serverItems,
    assignees,
}: {
    items: PlanningItem[];
    assignees: PlanningAssignee[];
}) {
    const [items, setItems] = useState(serverItems);
    const [zoom, setZoom] = useState<Zoom>("month");
    const [showPast, setShowPast] = useState(false);
    const [assigneeFilter, setAssigneeFilter] = useState(ALL_ASSIGNEES);
    const [drawer, setDrawer] = useState<DrawerState | null>(null);
    const [draft, setDraft] = useState<Pick<
        Drag,
        "id" | "start" | "end"
    > | null>(null);

    /**
     * Seeded with the UTC day so server and client render the same markup,
     * then corrected to the viewer's local day after hydration.
     */
    const [today, setToday] = useState(() => Math.floor(Date.now() / 86_400_000));
    useEffect(() => setToday(todayDayNum()), []);

    // Revalidated server data replaces local state (e.g. after another save).
    useEffect(() => setItems(serverItems), [serverItems]);

    const scrollRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<Drag | null>(null);

    const assigneesById = useMemo(
        () => new Map(assignees.map((a) => [a.id, a])),
        [assignees]
    );

    /**
     * Sorted from committed items only, so a bar being dragged keeps its row
     * (and the range doesn't shift) until it is dropped; then it re-slots.
     */
    const { visibleItems, pastCount } = useMemo(() => {
        const sorted = items
            .filter((i) =>
                assigneeFilter === ALL_ASSIGNEES
                    ? true
                    : assigneeFilter === UNASSIGNED
                      ? i.assigneeId === null
                      : i.assigneeId === assigneeFilter
            )
            .toSorted(comparePlanningItems);
        const past = sorted.filter(
            (i) => today - toDayNum(i.endDate) > PAST_GRACE_DAYS
        );

        return {
            visibleItems: showPast
                ? sorted
                : sorted.filter((i) => !past.includes(i)),
            pastCount: past.length,
        };
    }, [items, showPast, today, assigneeFilter]);

    const scale = useMemo(
        () => buildScale(visibleItems, zoom, today),
        [visibleItems, zoom, today]
    );
    const { rangeStart, dayWidth, totalWidth } = scale;
    const xOf = (dayNum: number) => (dayNum - rangeStart) * dayWidth;

    const scrollToDay = useCallback(
        (dayNum: number) => {
            const el = scrollRef.current;
            if (!el) return;
            el.scrollLeft =
                (dayNum - rangeStart) * dayWidth -
                (el.clientWidth - LEFT_WIDTH) / 3;
        },
        [rangeStart, dayWidth]
    );

    // Re-centre on today whenever the scale changes shape (zoom or first load).
    // biome-ignore lint/correctness/useExhaustiveDependencies: only on zoom/today change, not every item edit
    useLayoutEffect(() => {
        scrollToDay(today);
    }, [zoom, today]);

    const scrollByPage = (direction: 1 | -1) => {
        const el = scrollRef.current;
        if (!el) return;
        el.scrollBy({
            left: direction * (el.clientWidth - LEFT_WIDTH) * 0.8,
            behavior: "smooth",
        });
    };

    const openNew = (startDay: number) =>
        setDrawer({
            item: null,
            draft: {
                title: "",
                description: "",
                startDate: fromDayNum(startDay),
                endDate: fromDayNum(startDay + NEW_ITEM_DAYS - 1),
                status: "PLANNED",
                color: "BLUE",
                assigneeId: null,
            },
        });

    const openEdit = (item: PlanningItem) =>
        setDrawer({
            item,
            draft: {
                title: item.title,
                description: item.description,
                startDate: item.startDate,
                endDate: item.endDate,
                status: item.status,
                color: item.color,
                assigneeId: item.assigneeId,
            },
        });

    const upsertLocal = (item: PlanningItem) =>
        setItems((prev) =>
            prev.some((i) => i.id === item.id)
                ? prev.map((i) => (i.id === item.id ? item : i))
                : [...prev, item]
        );

    const handleBarPointerDown = (
        e: ReactPointerEvent<HTMLButtonElement>,
        item: PlanningItem
    ) => {
        if (e.button !== 0) return;

        const handle = (e.target as HTMLElement).closest<HTMLElement>(
            "[data-handle]"
        )?.dataset.handle;

        e.currentTarget.setPointerCapture(e.pointerId);

        const start = toDayNum(item.startDate);
        const end = toDayNum(item.endDate);

        dragRef.current = {
            id: item.id,
            mode: handle === "start" || handle === "end" ? handle : "move",
            originX: e.clientX,
            originStart: start,
            originEnd: end,
            start,
            end,
            moved: false,
        };
    };

    const handleBarPointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
        const drag = dragRef.current;
        if (!drag) return;

        const dx = e.clientX - drag.originX;
        if (!drag.moved && Math.abs(dx) < DRAG_THRESHOLD) return;
        drag.moved = true;

        const delta = Math.round(dx / dayWidth);
        const { originStart, originEnd } = drag;

        if (drag.mode === "move") {
            drag.start = originStart + delta;
            drag.end = originEnd + delta;
        } else if (drag.mode === "start") {
            drag.start = Math.min(originStart + delta, originEnd);
        } else {
            drag.end = Math.max(originEnd + delta, originStart);
        }

        setDraft({ id: drag.id, start: drag.start, end: drag.end });
    };

    const handleBarPointerUp = async (item: PlanningItem) => {
        const drag = dragRef.current;
        dragRef.current = null;
        setDraft(null);

        if (!drag) return;

        if (!drag.moved) {
            openEdit(item);
            return;
        }

        if (drag.start === drag.originStart && drag.end === drag.originEnd) {
            return;
        }

        const data = {
            startDate: fromDayNum(drag.start),
            endDate: fromDayNum(drag.end),
        };

        // Optimistic: keep the bar where it was dropped while the save runs.
        upsertLocal({ ...item, ...data });

        const resp = await actionUpdatePlanningItem({ id: item.id, data });

        if (resp.error || !resp.data) {
            upsertLocal(item);
            toast.error(resp.message);
            return;
        }

        upsertLocal(resp.data);
    };

    const handleBarPointerCancel = () => {
        dragRef.current = null;
        setDraft(null);
    };

    const todayX = xOf(today);

    return (
        <div className="w-full flex flex-col gap-3">
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                flexWrap="wrap"
                gap={1.5}
            >
                <Stack direction="row" alignItems="center" gap={0.5}>
                    <IconButton
                        size="small"
                        aria-label="Scroll back"
                        onClick={() => scrollByPage(-1)}
                    >
                        <ChevronLeftIcon />
                    </IconButton>
                    <Button size="small" onClick={() => scrollToDay(today)}>
                        Today
                    </Button>
                    <IconButton
                        size="small"
                        aria-label="Scroll forward"
                        onClick={() => scrollByPage(1)}
                    >
                        <ChevronRightIcon />
                    </IconButton>
                </Stack>
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1.5}
                    flexWrap="wrap"
                >
                    <TextField
                        select
                        size="small"
                        label="Assignee"
                        value={assigneeFilter}
                        onChange={(e) => setAssigneeFilter(e.target.value)}
                        slotProps={NO_SCROLL_LOCK_SELECT}
                        sx={{ minWidth: 180 }}
                    >
                        <MenuItem value={ALL_ASSIGNEES}>All</MenuItem>
                        <MenuItem value={UNASSIGNED}>
                            <em>Unassigned</em>
                        </MenuItem>
                        {assignees.map((a) => (
                            <MenuItem key={a.id} value={a.id}>
                                <Stack direction="row" alignItems="center" gap={1}>
                                    <AssigneeAvatar assignee={a} size={20} />
                                    {a.name ?? a.email}
                                </Stack>
                            </MenuItem>
                        ))}
                    </TextField>
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                checked={showPast}
                                onChange={(e) => setShowPast(e.target.checked)}
                            />
                        }
                        label={`Show past (${pastCount})`}
                        slotProps={{ typography: { variant: "body2" } }}
                    />
                    <ToggleButtonGroup
                        size="small"
                        exclusive
                        value={zoom}
                        onChange={(_, value: Zoom | null) =>
                            value && setZoom(value)
                        }
                        aria-label="Zoom"
                    >
                        {ZOOMS.map((z) => (
                            <ToggleButton key={z} value={z}>
                                {zoomLabel(z)}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => openNew(today)}
                    >
                        New item
                    </Button>
                </Stack>
            </Stack>

            <div
                ref={scrollRef}
                className="relative overflow-auto rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 h-[calc(100vh-220px)] min-h-[360px] select-none"
            >
                <div
                    className="relative"
                    style={{ width: LEFT_WIDTH + totalWidth }}
                >
                    {/* Header */}
                    <div
                        className="sticky top-0 z-30 flex bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700"
                        style={{ height: HEADER_TIER_HEIGHT * 2 }}
                    >
                        <div
                            className="sticky left-0 z-10 shrink-0 flex items-end px-3 pb-1 text-xs text-neutral-500 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700"
                            style={{ width: LEFT_WIDTH }}
                        >
                            {visibleItems.length}{" "}
                            {visibleItems.length === 1 ? "item" : "items"}
                        </div>
                        <div className="relative" style={{ width: totalWidth }}>
                            {scale.top.map((seg) => (
                                <div
                                    key={`t${seg.start}`}
                                    className="absolute top-0 border-l border-neutral-200 dark:border-neutral-700 px-2 text-xs font-semibold leading-[26px] whitespace-nowrap overflow-hidden"
                                    style={{
                                        left: xOf(seg.start),
                                        width: seg.days * dayWidth,
                                        height: HEADER_TIER_HEIGHT,
                                    }}
                                >
                                    {seg.label}
                                </div>
                            ))}
                            {scale.bottom.map((seg) => (
                                <div
                                    key={`b${seg.start}`}
                                    className={cn(
                                        "absolute text-[11px] leading-[26px] text-neutral-500 whitespace-nowrap overflow-hidden",
                                        zoom === "week" ? "text-center" : "pl-1"
                                    )}
                                    style={{
                                        top: HEADER_TIER_HEIGHT,
                                        left: xOf(seg.start),
                                        width: seg.days * dayWidth,
                                        height: HEADER_TIER_HEIGHT,
                                    }}
                                >
                                    {seg.label}
                                </div>
                            ))}
                            <div
                                className="absolute -translate-x-1/2 rounded-sm bg-rose-500 px-1 text-[10px] font-semibold leading-4 text-white"
                                style={{ left: todayX, bottom: 2 }}
                            >
                                Today
                            </div>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="relative">
                        {/* Grid background */}
                        <div
                            className="absolute inset-y-0 pointer-events-none"
                            style={{ left: LEFT_WIDTH, width: totalWidth }}
                            aria-hidden
                        >
                            {scale.bottom.map((seg) => (
                                <div
                                    key={seg.start}
                                    className={cn(
                                        "absolute inset-y-0 border-l border-neutral-100 dark:border-neutral-800",
                                        seg.muted &&
                                            "bg-neutral-50 dark:bg-neutral-800/40"
                                    )}
                                    style={{
                                        left: xOf(seg.start),
                                        width: seg.days * dayWidth,
                                    }}
                                />
                            ))}
                            <div
                                className="absolute inset-y-0 w-px bg-rose-500"
                                style={{ left: todayX }}
                            />
                        </div>

                        {visibleItems.map((item) => {
                            const isDragging = draft?.id === item.id;
                            const start = isDragging
                                ? draft.start
                                : toDayNum(item.startDate);
                            const end = isDragging
                                ? draft.end
                                : toDayNum(item.endDate);
                            const assignee = item.assigneeId
                                ? assigneesById.get(item.assigneeId)
                                : undefined;
                            const status = STATUS_META[item.status];
                            const paint = statusPaint({
                                color: item.color,
                                status: item.status,
                            });
                            const barWidth = Math.max(
                                (end - start + 1) * dayWidth,
                                6
                            );
                            const dateRange = `${formatDay(start, { month: "short", day: "numeric" })} – ${formatDay(end, { month: "short", day: "numeric" })}`;

                            return (
                                <div
                                    key={item.id}
                                    className="flex border-b border-neutral-100 dark:border-neutral-800"
                                    style={{ height: ROW_HEIGHT }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => openEdit(item)}
                                        className="sticky left-0 z-20 shrink-0 flex items-center gap-2 px-3 text-left text-sm bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                                        style={{ width: LEFT_WIDTH }}
                                    >
                                        <StatusSwatch
                                            color={item.color}
                                            status={item.status}
                                        />
                                        <span
                                            className={cn(
                                                "flex-1 truncate",
                                                item.status === "DONE" &&
                                                    "line-through text-neutral-400"
                                            )}
                                        >
                                            {item.title}
                                            <span className="sr-only">
                                                {`, ${status.label}`}
                                            </span>
                                        </span>
                                        {assignee && (
                                            <Tooltip
                                                title={assignee.name ?? assignee.email}
                                            >
                                                <AssigneeAvatar
                                                    assignee={assignee}
                                                    size={22}
                                                />
                                            </Tooltip>
                                        )}
                                    </button>

                                    <div
                                        className="relative"
                                        style={{ width: totalWidth }}
                                    >
                                        <Tooltip
                                            // Empty while dragging so the card never covers the drop target.
                                            title={
                                                isDragging ? (
                                                    ""
                                                ) : (
                                                    <BarTooltip
                                                    item={item}
                                                    start={start}
                                                    end={end}
                                                    assignee={assignee}
                                                />
                                                )
                                            }
                                            placement="top-start"
                                            slotProps={BAR_TOOLTIP_SLOT_PROPS}
                                            enterDelay={400}
                                            enterNextDelay={200}
                                        >
                                            <button
                                                type="button"
                                                aria-label={`${item.title}, ${status.label}, ${dateRange}`}
                                                onPointerDown={(e) =>
                                                    handleBarPointerDown(e, item)
                                                }
                                                onPointerMove={handleBarPointerMove}
                                                onPointerUp={() =>
                                                    handleBarPointerUp(item)
                                                }
                                                onPointerCancel={handleBarPointerCancel}
                                                // Pointer presses are handled above; this is keyboard activation only.
                                                onClick={(e) => {
                                                    if (e.detail === 0) openEdit(item);
                                                }}
                                                className={cn(
                                                    "group absolute top-1.5 flex items-center rounded-md border text-xs font-medium touch-none cursor-grab",
                                                    "text-neutral-900 dark:text-neutral-50",
                                                    paint.className,
                                                    isDragging &&
                                                        "cursor-grabbing shadow-lg z-10"
                                                )}
                                                style={{
                                                    ...paint.style,
                                                    left: xOf(start),
                                                    width: barWidth,
                                                    height: ROW_HEIGHT - 12,
                                                }}
                                            >
                                                <span
                                                    data-handle="start"
                                                    className="absolute inset-y-0 left-0 w-2 cursor-ew-resize rounded-l-md group-hover:bg-black/10 dark:group-hover:bg-white/15"
                                                />
                                                {assignee &&
                                                    barWidth >= BAR_AVATAR_MIN_WIDTH && (
                                                        <AssigneeAvatar
                                                            assignee={assignee}
                                                            size={20}
                                                            className="ml-1.5 shrink-0 pointer-events-none"
                                                        />
                                                    )}
                                                <span className="truncate px-2">
                                                    {isDragging ? dateRange : item.title}
                                                </span>
                                                <span
                                                    data-handle="end"
                                                    className="absolute inset-y-0 right-0 w-2 cursor-ew-resize rounded-r-md group-hover:bg-black/10 dark:group-hover:bg-white/15"
                                                />
                                            </button>
                                        </Tooltip>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Click anywhere on this row to add an item starting that day. */}
                        <div className="flex" style={{ height: ROW_HEIGHT }}>
                            <button
                                type="button"
                                onClick={() => openNew(today)}
                                className="sticky left-0 z-20 shrink-0 flex items-center gap-2 px-3 text-sm text-neutral-500 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                                style={{ width: LEFT_WIDTH }}
                            >
                                <AddIcon fontSize="small" /> Add item
                            </button>
                            <button
                                type="button"
                                aria-label="Add item on clicked date"
                                className="relative cursor-copy hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40"
                                style={{ width: totalWidth }}
                                onClick={(e) => {
                                    if (e.detail === 0) {
                                        openNew(today);
                                        return;
                                    }
                                    const rect =
                                        e.currentTarget.getBoundingClientRect();
                                    openNew(
                                        rangeStart +
                                            Math.floor(
                                                (e.clientX - rect.left) / dayWidth
                                            )
                                    );
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <PlanningItemDrawer
                state={drawer}
                assignees={assignees}
                onClose={() => setDrawer(null)}
                onSaved={upsertLocal}
                onDeleted={(id) =>
                    setItems((prev) => prev.filter((i) => i.id !== id))
                }
            />
        </div>
    );
}
