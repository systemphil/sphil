"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import type { Course, Lesson } from "@prisma/client";
import { TextInput } from "./TextInput";
import { TextAreaInput } from "./TextAreaInput";
import { SubmitInput } from "./SubmitInput";
import { dbGetLessonAndRelationsById } from "lib/database/dbFuncs";
import { useState } from "react";
import { actionUpsertLesson } from "features/courses/server/actions";
import toast from "react-hot-toast";

/**
 * Form component for Lesson data models. Must receive a courseId, since every lesson presupposes
 * an existing course of which it is part of. May receive initial lesson and lessonId as props,
 * in which case it will populate the form with existing data and activate the clientside
 * query for refetching, otherwise it will start with a blank form.
 */
export const LessonForm = ({
    courseId,
    lesson,
}: {
    courseId: Course["id"];
    lesson?: Awaited<ReturnType<typeof dbGetLessonAndRelationsById>>;
}) => {
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const router = useRouter();
    const params = useParams();

    const onSubmit: SubmitHandler<Lesson> = async (data) => {
        setSubmitLoading(true);
        const resp = await actionUpsertLesson(data);
        if (resp?.error) {
            toast.error(`Error updating course ${resp.error}`);
        } else {
            toast.success("Course updated successfully");
        }
        setSubmitLoading(false);
        if (resp.data && params?.lessonId !== resp.data.id) {
            toast.success("Redirecting...");
            router.push(`/admin/courses/${courseId}/lessons/${resp.data.id}`);
        }
    };

    const methods = useForm<Lesson>({
        defaultValues: {
            id: lesson?.id,
            name: lesson?.name,
            description: lesson?.description,
            slug: lesson?.slug,
            partId: lesson?.partId,
            courseId: courseId,
        },
    });

    return (
        <FormProvider {...methods}>
            <form
                className="flex flex-col max-w-lg"
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <TextInput
                    label="Name*"
                    name="name"
                    options={{ required: true }}
                />
                <TextInput
                    label="Slug* (the lesson link)"
                    name="slug"
                    options={{
                        required: true,
                        pattern: {
                            value: /^[a-z0-9-]+$/,
                            message:
                                "Only lowercase letters, numbers, and hyphens are allowed",
                        },
                    }}
                />
                <TextAreaInput
                    label="Description*"
                    name="description"
                    options={{ required: true }}
                />
                <SubmitInput
                    value={`${lesson ? "Update" : "Create"} lesson`}
                    isLoading={submitLoading}
                />
            </form>
        </FormProvider>
    );
};
