"use client";

import {
    Box,
    Button,
    Drawer,
    IconButton,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { cn } from "lib/utils";
import {
    actionCreatePlanningItem,
    actionDeletePlanningItem,
    actionUpdatePlanningItem,
} from "../server/actions";
import {
    PLANNING_ITEM_COLORS,
    PLANNING_ITEM_STATUSES,
    type PlanningAssignee,
    type PlanningItem,
    type PlanningItemInput,
} from "../types";
import {
    COLOR_SWATCH_CLASSES,
    NO_SCROLL_LOCK_SELECT,
    STATUS_META,
} from "./planningStyles";
import { StatusSwatch } from "./StatusSwatch";

/** `item` is null when creating; `draft` seeds the form either way. */
export type DrawerState = {
    item: PlanningItem | null;
    draft: PlanningItemInput;
};

export function PlanningItemDrawer({
    state,
    assignees,
    onClose,
    onSaved,
    onDeleted,
}: {
    state: DrawerState | null;
    assignees: PlanningAssignee[];
    onClose: () => void;
    onSaved: (item: PlanningItem) => void;
    onDeleted: (id: string) => void;
}) {
    const [form, setForm] = useState<PlanningItemInput | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        setForm(state?.draft ?? null);
        setConfirmDelete(false);
    }, [state]);

    const item = state?.item ?? null;

    const set = <K extends keyof PlanningItemInput>(
        key: K,
        value: PlanningItemInput[K]
    ) => setForm((prev) => (prev ? { ...prev, [key]: value } : prev));

    const dateError =
        form && form.endDate < form.startDate
            ? "End date cannot be before start date"
            : null;

    const handleSave = async () => {
        if (!form) return;

        setIsPending(true);
        const resp = item
            ? await actionUpdatePlanningItem({ id: item.id, data: form })
            : await actionCreatePlanningItem(form);
        setIsPending(false);

        if (resp.error || !resp.data) {
            toast.error(resp.message);
            return;
        }

        toast.success(item ? "Item updated" : "Item created");
        onSaved(resp.data);
        onClose();
    };

    const handleDelete = async () => {
        if (!item) return;

        if (!confirmDelete) {
            setConfirmDelete(true);
            return;
        }

        setIsPending(true);
        const resp = await actionDeletePlanningItem({ id: item.id });
        setIsPending(false);

        if (resp.error) {
            toast.error(resp.message);
            return;
        }

        toast.success("Item deleted");
        onDeleted(item.id);
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={state !== null}
            onClose={onClose}
            disableScrollLock
            slotProps={{ paper: { sx: { width: { xs: "100%", sm: 480 } } } }}
        >
            {form && (
                <Box
                    component="form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSave();
                    }}
                    sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}
                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                    >
                        <Typography variant="h6">
                            {item ? "Edit item" : "New item"}
                        </Typography>
                        <IconButton onClick={onClose} aria-label="Close">
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <TextField
                        label="Title"
                        value={form.title}
                        onChange={(e) => set("title", e.target.value)}
                        required
                        autoFocus={!item}
                    />

                    <Stack direction="row" gap={2}>
                        <TextField
                            label="Start"
                            type="date"
                            value={form.startDate}
                            onChange={(e) => set("startDate", e.target.value)}
                            required
                            fullWidth
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                        <TextField
                            label="End"
                            type="date"
                            value={form.endDate}
                            onChange={(e) => set("endDate", e.target.value)}
                            required
                            fullWidth
                            error={dateError !== null}
                            helperText={dateError}
                            slotProps={{ inputLabel: { shrink: true } }}
                        />
                    </Stack>

                    <Stack direction="row" gap={2}>
                        <TextField
                            select
                            slotProps={NO_SCROLL_LOCK_SELECT}
                            label="Status"
                            value={form.status}
                            onChange={(e) =>
                                set(
                                    "status",
                                    e.target.value as PlanningItemInput["status"]
                                )
                            }
                            fullWidth
                        >
                            {PLANNING_ITEM_STATUSES.map((status) => (
                                <MenuItem key={status} value={status}>
                                    <Stack direction="row" alignItems="center" gap={1}>
                                        <StatusSwatch
                                            color={form.color}
                                            status={status}
                                        />
                                        {STATUS_META[status].label}
                                    </Stack>
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            slotProps={NO_SCROLL_LOCK_SELECT}
                            label="Assignee"
                            value={form.assigneeId ?? ""}
                            onChange={(e) =>
                                set("assigneeId", e.target.value || null)
                            }
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Unassigned</em>
                            </MenuItem>
                            {assignees.map((a) => (
                                <MenuItem key={a.id} value={a.id}>
                                    {a.name ?? a.email}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>

                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            Colour
                        </Typography>
                        <Stack direction="row" gap={1} mt={0.5}>
                            {PLANNING_ITEM_COLORS.map((color) => (
                                <Tooltip key={color} title={color.toLowerCase()}>
                                    <button
                                        type="button"
                                        aria-label={color.toLowerCase()}
                                        aria-pressed={form.color === color}
                                        onClick={() => set("color", color)}
                                        className={cn(
                                            "size-7 rounded-full cursor-pointer ring-offset-2 ring-offset-white dark:ring-offset-neutral-900",
                                            COLOR_SWATCH_CLASSES[color],
                                            form.color === color &&
                                                "ring-2 ring-neutral-800 dark:ring-neutral-100"
                                        )}
                                    />
                                </Tooltip>
                            ))}
                        </Stack>
                    </Box>

                    <TextField
                        label="Description"
                        value={form.description}
                        onChange={(e) => set("description", e.target.value)}
                        multiline
                        minRows={8}
                    />

                    <Stack direction="row" gap={1} justifyContent="space-between">
                        {item ? (
                            <Button
                                color="error"
                                variant={confirmDelete ? "contained" : "text"}
                                onClick={handleDelete}
                                disabled={isPending}
                            >
                                {confirmDelete ? "Confirm delete" : "Delete"}
                            </Button>
                        ) : (
                            <span />
                        )}
                        <Stack direction="row" gap={1}>
                            <Button onClick={onClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={
                                    isPending ||
                                    dateError !== null ||
                                    !form.title.trim()
                                }
                            >
                                {item ? "Save" : "Create"}
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            )}
        </Drawer>
    );
}
