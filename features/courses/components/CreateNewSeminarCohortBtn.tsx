"use client";

import toast from "react-hot-toast";
import { actionCreateSeminarCohort } from "../server/actions";

export const CreateNewSeminarCohortBtn = ({
    courseId,
    currentYear,
}: {
    courseId: string;
    currentYear: number;
}) => {
    async function handleClick() {
        const res = await actionCreateSeminarCohort({ courseId, currentYear });
        if (res.error) {
            toast.error(res.message);
        } else {
            toast.success("Created new cohort!");
        }
    }

    return (
        <div className="flex justify-center">
            <button onClick={handleClick} className="d-btn d-btn-primary">
                Make New Cohort Now
            </button>
        </div>
    );
};
