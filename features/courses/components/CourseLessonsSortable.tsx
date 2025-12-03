"use client";

import type { Lesson } from "@prisma/client";
import { SortableItem, SortableList } from "lib/components/SortableList";
import { CourseMaterialCard } from "./CourseMaterialCard";
import { actionUpdateLessonOrder } from "../server/actions";

export const CourseLessonsSortable = ({
    courseId,
    lessons,
}: {
    courseId: string;
    lessons: Lesson[];
}) => {
    return (
        <SortableList items={lessons} onOrderChange={actionUpdateLessonOrder}>
            {(items) =>
                items.map((lesson) => (
                    <SortableItem
                        key={lesson.id}
                        id={lesson.id}
                        className="flex items-center gap-1 w-full"
                    >
                        <CourseMaterialCard
                            key={lesson.id}
                            href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                            heading={lesson.name}
                            id={lesson.id}
                            modelName="Lesson"
                        />
                    </SortableItem>
                ))
            }
        </SortableList>
    );
};
