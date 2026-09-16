"use client";

import { Alert, Button, Stack, TextField } from "@mui/material";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    actionSetAdminDocumentArchived,
    actionUpdateAdminDocument,
} from "../server/actions";
import { formatEditedAt } from "../utils/formatEditedAt";

const MdxEditorCore = dynamic(
    () => import("features/editor/components/MdxEditorCore"),
    { ssr: false }
);

type Person = { name: string | null; email: string } | null;

export function DocumentEditor({
    document,
}: {
    document: {
        id: string;
        title: string;
        content: string;
        updatedAt: string;
        archivedAt: string | null;
        lastEditor: Person;
    };
}) {
    const router = useRouter();
    const [title, setTitle] = useState(document.title);
    const [savedTitle, setSavedTitle] = useState(document.title);
    const [meta, setMeta] = useState({
        updatedAt: document.updatedAt,
        lastEditor: document.lastEditor,
    });
    const [isArchiving, setIsArchiving] = useState(false);
    const isArchived = document.archivedAt !== null;

    const titleError = title.trim() ? null : "Title is required";

    const save = async (data: { title?: string; content?: string }) => {
        const resp = await actionUpdateAdminDocument({
            id: document.id,
            ...data,
        });

        if (resp.error || !resp.data) {
            toast.error(resp.message);
            return false;
        }

        setSavedTitle(resp.data.title);
        setMeta({
            updatedAt: resp.data.updatedAt.toISOString(),
            lastEditor: resp.data.lastEditor,
        });
        return true;
    };

    // The editor's save button saves the title too, so one click saves everything.
    const handleSaveContent = async (content: string) => {
        if (titleError) {
            toast.error(titleError);
            return;
        }
        if (await save({ title: title.trim(), content })) {
            toast.success("Document saved");
        }
    };

    const handleTitleBlur = async () => {
        if (titleError || title.trim() === savedTitle) return;
        if (await save({ title: title.trim() })) {
            toast.success("Title saved");
        }
    };

    const handleSetArchived = async (archived: boolean) => {
        setIsArchiving(true);
        const resp = await actionSetAdminDocumentArchived({
            id: document.id,
            archived,
        });
        setIsArchiving(false);

        if (resp.error) {
            toast.error(resp.message);
            return;
        }

        if (archived) {
            toast.success("Document archived");
            router.push("/admin/documents");
        } else {
            toast.success("Document restored");
            router.refresh();
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-4">
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
            >
                <Button
                    component={Link}
                    href="/admin/documents"
                    startIcon={<ArrowBackIcon />}
                    size="small"
                >
                    Documents
                </Button>
                {!isArchived && (
                    <Button
                        color="inherit"
                        size="small"
                        startIcon={<ArchiveOutlinedIcon />}
                        onClick={() => handleSetArchived(true)}
                        disabled={isArchiving}
                    >
                        Archive
                    </Button>
                )}
            </Stack>

            {isArchived && (
                <Alert
                    severity="info"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => handleSetArchived(false)}
                            disabled={isArchiving}
                        >
                            Restore
                        </Button>
                    }
                >
                    This document is archived and hidden from the documents
                    list.
                </Alert>
            )}

            <div className="flex flex-col gap-1">
                <TextField
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                    }}
                    error={titleError !== null}
                    helperText={titleError}
                    placeholder="Document title"
                    slotProps={{
                        htmlInput: {
                            "aria-label": "Document title",
                            maxLength: 200,
                        },
                        input: {
                            disableUnderline: !titleError,
                            sx: { fontSize: 28, fontWeight: 600 },
                        },
                    }}
                    fullWidth
                />
                {/* Relative time can tick over between server render and hydration. */}
                <span className="text-xs text-neutral-500" suppressHydrationWarning>
                    {formatEditedAt(meta.updatedAt, meta.lastEditor)}
                </span>
            </div>

            <MdxEditorCore
                // End of the document; for a fresh (empty) one that is also the start.
                autoFocus={{ defaultSelection: "rootEnd" }}
                markdown={document.content}
                onSave={handleSaveContent}
            />
        </div>
    );
}
