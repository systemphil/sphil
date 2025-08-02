"use client";

import { useState } from "react";
import { actionCreateSeminar } from "../server/actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { sleep } from "lib/utils";

export function SeminarCreateNewButton({
    courseId,
    seminarCohortId,
}: {
    courseId: string;
    seminarCohortId: string;
}) {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleNewSeminar = async () => {
        try {
            setIsPending(true);

            const resp = await actionCreateSeminar({ seminarCohortId });

            if (resp?.error) {
                toast.error(`Error creating seminar: ${resp.error}`);
                return;
            }

            const seminarId = resp.data?.seminarId;
            if (!seminarId) {
                toast.error(
                    `Error getting seminar data: ${resp.message || "Missing seminar ID"}`
                );
                return;
            }

            toast.success("Created! Redirecting...");
            await sleep(1000);
            router.push(
                `/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminar/${seminarId}`
            );
        } catch (err) {
            toast.error("Unexpected error occurred while creating seminar.");
            console.error(err);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <button
            className="d-btn d-btn-primary"
            onClick={handleNewSeminar}
            disabled={isPending}
        >
            Add a seminar
        </button>
    );
}
