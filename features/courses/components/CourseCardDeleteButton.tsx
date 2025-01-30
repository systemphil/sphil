"use client";

import { Alert, Dialog, DialogActions, DialogContent } from "@mui/material";
import toast from "react-hot-toast";
import { actionDeleteModelEntry } from "../server/actions";
import { useState } from "react";
import { ModelName } from "lib/server/ctrl";

export function CourseCardDeleteButton({
    id,
    modelName,
}: {
    id: string;
    modelName: ModelName;
}) {
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
        <>
            <button
                className="d-btn d-btn-error d-btn-sm hover:bg-red-600"
                disabled={isPending}
                onClick={() => setIsDialogOpen(true)}
            >
                Delete Course
            </button>
            <Dialog open={isDialogOpen} onClose={onClose}>
                <DialogContent>
                    Are you sure you want to delete this {modelName} item? This
                    action cannot be undone.
                </DialogContent>
                <Alert severity="error">
                    This will remove the entire course, its lessons, videos,
                    stripe integration and all related content.
                </Alert>
                <DialogActions>
                    <button
                        className="d-btn d-btn-error"
                        disabled={isPending}
                        onClick={handleDeleteEntry}
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </button>
                </DialogActions>
            </Dialog>
        </>
    );
}
