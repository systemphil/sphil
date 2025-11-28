"use client";

import Link from "next/link";
import { Heading } from "lib/components/ui/Heading";
import type { ModelName } from "lib/server/ctrl";
import { actionDeleteModelEntry } from "../server/actions";
import toast from "react-hot-toast";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
} from "@mui/material";
import { useState } from "react";

type CourseMaterialCardProps = {
    href: string;
    heading: string;
    id: string;
    modelName: ModelName;
};
/**
 * A click-able card that displays a heading and links to provided href.
 */
export function CourseMaterialCard({
    href,
    heading,
    id,
    modelName,
}: CourseMaterialCardProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleDeleteEntry = async () => {
        setIsPending(true);
        const payload = {
            id,
            modelName,
        };
        const resp = await actionDeleteModelEntry(payload);
        if (resp?.error) {
            toast.error(`Error deleting item ${resp.error}`);
        } else {
            toast.success("Item deleted successfully");
        }
        setIsPending(false);
        setIsDialogOpen(false);
    };

    const onClose = () => {
        setIsDialogOpen(false);
    };

    return (
        <div className="flex w-full border border-gray-200 rounded-lg hover:bg-slate-100 duration-300 justify-between items-center">
            <div className="flex grow p-2">
                <Heading as="h6">{heading}</Heading>
            </div>
            <Box display="flex" gap={2} px={1}>
                <Button
                    variant="contained"
                    href={href}
                    size="small"
                    LinkComponent={Link}
                >
                    Edit
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    size="small"
                    disabled={modelName === "UNSUPPORTED" || isPending}
                    onClick={() => setIsDialogOpen(true)}
                >
                    <ButtonDeleteCross />
                </Button>
            </Box>
            <Dialog open={isDialogOpen} onClose={onClose} disableScrollLock>
                <DialogContent>
                    Are you sure you want to delete this{" "}
                    {modelName.toLowerCase()} item? This action cannot be
                    undone.
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="error"
                        disabled={isPending}
                        onClick={handleDeleteEntry}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const ButtonDeleteCross = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <title>Button Delete cross</title>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );
};
