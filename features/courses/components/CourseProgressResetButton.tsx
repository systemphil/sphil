"use client";

import { useTransition } from "react";
import { Button } from "@mui/material";
import { actionCourseProgressReset } from "../server/actions";
import toast from "react-hot-toast";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export function CourseProgressResetButton({ courseId }: { courseId: string }) {
    const [isPending, startTransition] = useTransition();

    const handle = () => {
        if (isPending) {
            return;
        }

        startTransition(async () => {
            const res = await actionCourseProgressReset({
                courseId,
            });

            if (res?.error) {
                console.error("Failed to update lesson progress", res.message);
                toast.error("Error occurred");
            } else {
                toast.success("Course progress successfully reset");
            }
        });
    };

    return (
        <div className="flex justify-center">
            <Button
                onClick={handle}
                variant={"contained"}
                size="small"
                startIcon={<RestartAltIcon />}
                color={"inherit"}
                style={{ cursor: isPending ? "wait" : "pointer" }}
            >
                Reset course progress
            </Button>
        </div>
    );
}
