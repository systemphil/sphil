"use client";

import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import Image from "next/image";
import { TextInput } from "./TextInput";
import { TextAreaInput } from "./TextAreaInput";
import { NumberInput } from "./NumberInput";
import { Checkbox } from "./Checkbox";
import { SubmitInput } from "./SubmitInput";
import { ImageFileInput } from "./ImageFileInput";
import { DateInput } from "./DateInput";
import { sleep } from "lib/utils";
import { Course } from "@prisma/client";
import { actionUpsertCourse } from "features/courses/server/actions";
import { DbUpsertCourseByIdProps } from "lib/database/dbFuncs";
import { actionUploadImage } from "lib/server/actions";

type AmendedDbUpsertCourseByIdProps = Omit<
    DbUpsertCourseByIdProps,
    "seminarAvailability" | "dialogueAvailability" | "baseAvailability"
> & {
    baseAvailability: string;
    seminarAvailability: string;
    dialogueAvailability: string;
};

export const CourseForm = ({ course }: { course?: Course }) => {
    const [currentImageUrl, setCurrentImageUrl] = useState<string>("");
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);
    const router = useRouter();
    const params = useParams();

    const onSubmit: SubmitHandler<AmendedDbUpsertCourseByIdProps> = async (
        data
    ) => {
        setSubmitLoading(true);
        const dataWithConvertedDates = {
            ...data,
            baseAvailability: new Date(data.baseAvailability),
            seminarAvailability: new Date(data.seminarAvailability),
            dialogueAvailability: new Date(data.dialogueAvailability),
        } satisfies DbUpsertCourseByIdProps;
        const resp = await actionUpsertCourse(dataWithConvertedDates);
        if (resp?.error) {
            toast.error(`Error updating course ${resp.error}`);
        } else {
            toast.success("Course updated successfully");
        }
        setSubmitLoading(false);
        if (resp.data && params.courseId !== resp.data.id) {
            toast.success("Redirecting...");
            router.push(`/admin/courses/${resp.data.id}`);
        }
    };

    const methods = useForm<AmendedDbUpsertCourseByIdProps>({
        values: {
            id: course?.id ?? "",
            name: course?.name ?? "",
            slug: course?.slug ?? "",
            description: course?.description ?? "",
            stripeBasePriceId: course?.stripeBasePriceId ?? "",
            stripeSeminarPriceId: course?.stripeSeminarPriceId ?? "",
            stripeDialoguePriceId: course?.stripeDialoguePriceId ?? "",
            stripeProductId: course?.stripeProductId ?? "",
            basePrice: course?.basePrice ?? 0,
            seminarPrice: course?.seminarPrice ?? 0,
            dialoguePrice: course?.dialoguePrice ?? 0,
            imageUrl: course?.imageUrl ?? "",
            author: course?.author ?? "",
            baseAvailability: course?.baseAvailability
                ? course.baseAvailability.toISOString().slice(0, 16)
                : new Date().toISOString().slice(0, 16),
            seminarAvailability: course?.seminarAvailability
                ? course.seminarAvailability.toISOString().slice(0, 16)
                : new Date().toISOString().slice(0, 16),
            dialogueAvailability: course?.dialogueAvailability
                ? course.dialogueAvailability.toISOString().slice(0, 16)
                : new Date().toISOString().slice(0, 16),
            published: course?.published ?? false,
        },
    });

    // Event handlers and other hooks
    const handleSelectedFileImageChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        const file = e.target && e.target.files && e.target.files[0];
        if (!file) {
            toast.error("No file selected");
            return;
        }
        const body = new FormData();
        body.set("image", file);

        const resp = await actionUploadImage(body);
        if (resp.error || !resp.data) {
            toast.error(`Error uploading profile image ${resp.error}`);
            return;
        }
        const imageUrl = resp.data.imageUrl;
        toast.success("Image uploaded!");
        methods.setValue("imageUrl", imageUrl);
        await sleep(1000);
        setCurrentImageUrl(imageUrl);
    };

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
                <p className="font-semibold text-xs dark:text-gray-500">
                    ℹ️ For slug, only lowercase letters, numbers, and hyphens
                    are allowed, no whitespace
                </p>
                <TextInput
                    label="Slug* (the course link)"
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
                <p className="font-semibold text-xs dark:text-gray-500">
                    ⚠️ Price is in <b>cents</b>, so be sure to add two extra 00
                    at the end
                </p>
                <NumberInput
                    label="Base Price* (in cents)"
                    name="basePrice"
                    options={{ valueAsNumber: true, required: true }}
                />
                <NumberInput
                    label="Seminar Price* (in cents)"
                    name="seminarPrice"
                    options={{ valueAsNumber: true, required: true }}
                />
                <NumberInput
                    label="Dialogue Price* (in cents)"
                    name="dialoguePrice"
                    options={{ valueAsNumber: true, required: true }}
                />
                <div className="h-[250px] max-w-[500px]">
                    {course?.imageUrl && !currentImageUrl && (
                        <>
                            <p className="font-bold">Current Course Image:</p>
                            <Image
                                src={course.imageUrl}
                                alt="Current Course Image"
                                width={250}
                                height={250}
                            />
                        </>
                    )}
                    {currentImageUrl && (
                        <>
                            <p style={{ fontWeight: "bolder" }}>
                                New Course Image:
                            </p>
                            <Image
                                src={currentImageUrl}
                                alt="New Course Image"
                                width={250}
                                height={250}
                            />
                        </>
                    )}
                    {!course?.imageUrl && !currentImageUrl && (
                        <p>No image uploaded</p>
                    )}
                </div>
                <ImageFileInput
                    label="Image"
                    name="fileInput"
                    options={{
                        required: false,
                        onChange: (e) => handleSelectedFileImageChange(e),
                    }}
                />
                <TextInput
                    label="Author"
                    name="author"
                    options={{ required: false }}
                />
                {/* 
                    TODO add utility to show when dates are in the past!
                */}
                <DateInput
                    label="Base Availability Until*"
                    name="baseAvailability"
                    options={{ required: true }}
                />
                <DateInput
                    label="Seminar Availability Until*"
                    name="seminarAvailability"
                    options={{ required: true }}
                />
                <DateInput
                    label="Dialogue Availability Until*"
                    name="dialogueAvailability"
                    options={{ required: true }}
                />
                <Checkbox label="Publish" name="published" />
                <SubmitInput
                    value={`${course ? "Update" : "Create"} course`}
                    isLoading={submitLoading}
                />
            </form>
            <div className="my-12">
                <button
                    className="btn btn-warning btn-xs m-2 border-dotted border-2 border-black hover:border-solid hover:border-black hover:border-2 duration-200"
                    onClick={() => {
                        console.info(methods.getValues());
                    }}
                >
                    DEBUG: Get form values
                </button>
            </div>
        </FormProvider>
    );
};
