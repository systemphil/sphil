"use client";

import { apiClientside } from "@/lib/trpc/trpcClientside";
import { useParams, useRouter } from "next/navigation";

import { type dbGetLessonAndRelationsById } from "@/server/controllers/dbController";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import type { Course, Lesson } from "@prisma/client";
import TextInput from "./TextInput";
import TextAreaInput from "./TextAreaInput";
import SubmitInput from "./SubmitInput";

/**
 * Form component for Lesson data models. Must receive a courseId, since every lesson presupposes
 * an existing course of which it is part of. May receive initial lesson and lessonId as props,
 * in which case it will populate the form with existing data and activate the clientside
 * query for refetching, otherwise it will start with a blank form.
 */
const LessonForm = ({
    courseId,
    initialLesson,
    lessonId,
}: {
    courseId: Course["id"];
    lessonId?: Lesson["id"];
    initialLesson?: Awaited<ReturnType<typeof dbGetLessonAndRelationsById>>;
}) => {
    const router = useRouter();
    const params = useParams();
    const utils = apiClientside.useContext();
    const { data: lesson } =
        apiClientside.db.getLessonAndRelationsById.useQuery(
            { id: lessonId },
            {
                initialData: initialLesson,
                refetchOnMount: false,
                refetchOnReconnect: false,
                enabled: lessonId ? true : false,
            }
        );

    const upsertLessonMutation = apiClientside.db.upsertLesson.useMutation({
        onSuccess: (newLesson) => {
            // toast.success('Course updated successfully')
            // If course is new, it should not match existing path and push user to new path. Otherwise, refresh data.
            if (params.lessonId !== newLesson.id) {
                console.log("pushing to new route");
                router.push(
                    `/admin/courses/${courseId}/lessons/${newLesson.id}`
                );
            } else {
                void utils.db.invalidate();
            }
        },
        onError: (error) => {
            console.error(error);
            // toast.error('Something went wrong')
        },
    });

    const onSubmit: SubmitHandler<Lesson> = async (data) => {
        upsertLessonMutation.mutate(data);
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
                    label="Slug*"
                    name="slug"
                    options={{ required: true }}
                />
                <TextAreaInput
                    label="Description*"
                    name="description"
                    options={{ required: true }}
                />
                {/* // TODO Add selection for partId here */}
                <SubmitInput
                    value={`${lesson ? "Update" : "Create"} lesson`}
                    isLoading={upsertLessonMutation.isLoading}
                />
            </form>
        </FormProvider>
    );
};

export default LessonForm;
