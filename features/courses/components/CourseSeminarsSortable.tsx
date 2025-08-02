"use client";

import { Seminar } from "@prisma/client";
import { SortableItem, SortableList } from "lib/components/SortableList";
import { CourseMaterialCard } from "./CourseMaterialCard";
import { actionUpdateSeminarOrder } from "../server/actions";

export const CourseSeminarsSortable = ({
    courseId,
    seminarCohortId,
    seminars,
}: {
    courseId: string;
    seminarCohortId: string;
    seminars: Seminar[];
}) => {
    return (
        <SortableList items={seminars} onOrderChange={actionUpdateSeminarOrder}>
            {(items) =>
                items.map((seminar) => (
                    <SortableItem
                        key={seminar.id}
                        id={seminar.id}
                        className="flex items-center gap-1 w-full"
                    >
                        <CourseMaterialCard
                            key={seminar.id}
                            href={`/admin/courses/${courseId}/seminar-cohort/${seminarCohortId}/seminars/${seminar.id}`}
                            heading={`${seminar.order}`}
                            id={seminar.id}
                            modelName="UNSUPPORTED"
                        />
                    </SortableItem>
                ))
            }
        </SortableList>
    );
};
