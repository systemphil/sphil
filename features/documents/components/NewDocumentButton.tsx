"use client";

import { Button, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { actionCreateAdminDocument } from "../server/actions";

/**
 * Creates a document with the typed title and opens it. The title stays
 * editable in the document editor.
 */
export function NewDocumentButton() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    /**
     * Pending until the navigation to the new document finishes. Unlike a
     * plain flag it can't get stuck when this page's state is restored on
     * returning to it.
     */
    const [isNavigating, startTransition] = useTransition();

    const isBusy = isCreating || isNavigating;
    const trimmed = title.trim();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trimmed || isBusy) return;

        setIsCreating(true);
        const resp = await actionCreateAdminDocument({ title: trimmed });
        setIsCreating(false);

        if (resp.error || !resp.data) {
            toast.error(resp.message);
            return;
        }

        const { id } = resp.data;
        setTitle("");
        startTransition(() => router.push(`/admin/documents/${id}`));
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <TextField
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="New document title"
                disabled={isBusy}
                slotProps={{
                    htmlInput: {
                        "aria-label": "New document title",
                        maxLength: 200,
                    },
                }}
                sx={{ minWidth: { xs: 0, sm: 240 }, flex: 1 }}
            />
            <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!trimmed || isBusy}
                sx={{ flexShrink: 0 }}
            >
                New document
            </Button>
        </form>
    );
}
