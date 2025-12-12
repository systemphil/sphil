"use client";

import { useOptimistic, useTransition } from "react";
import { Button } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { actionToggleLessonCompletion } from "../server/actions";
import toast from "react-hot-toast";

export function LessonCompletionButtonClient({
    isCompleted,
    lessonId,
    courseId,
}: {
    isCompleted: boolean;
    lessonId: string;
    courseId: string;
}) {
    const [isPending, startTransition] = useTransition();
    const [optimisticCompleted, setOptimisticCompleted] = useOptimistic(
        isCompleted,
        (_state, newState: boolean) => newState
    );

    const handleToggle = () => {
        if (isPending) {
            return;
        }

        const newState = !optimisticCompleted;

        startTransition(async () => {
            setOptimisticCompleted(newState);

            const res = await actionToggleLessonCompletion({
                lessonId,
                courseId,
            });

            if (res?.error) {
                setOptimisticCompleted(!newState);
                console.error("Failed to update lesson progress", res.message);
                toast.error("Could not save progress");
            }
        });
    };

    return (
        <div className="flex justify-center">
            <Button
                className="w-42 h-8"
                onClick={handleToggle}
                variant={optimisticCompleted ? "contained" : "outlined"}
                size="small"
                startIcon={
                    optimisticCompleted ? (
                        <TaskAltIcon />
                    ) : (
                        <RadioButtonUncheckedIcon />
                    )
                }
                color={optimisticCompleted ? "success" : "primary"}
                style={{ cursor: isPending ? "wait" : "pointer" }}
            >
                {optimisticCompleted ? "Completed" : "Mark Done"}
            </Button>
        </div>
    );
}
