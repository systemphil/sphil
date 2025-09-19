"use client";

import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import { NumberInput } from "./NumberInput";
import { SubmitInput } from "./SubmitInput";
import { SeminarCohort } from "@prisma/client";
import {
    actionUpdateSeminarCohort,
    ActionUpdateSeminarCohortInput,
} from "features/courses/server/actions";

export const SeminarCohortForm = ({
    seminarCohort,
}: {
    seminarCohort: SeminarCohort;
}) => {
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const onSubmit: SubmitHandler<ActionUpdateSeminarCohortInput> = async (
        data
    ) => {
        setSubmitLoading(true);

        const resp = await actionUpdateSeminarCohort(data);
        if (resp?.error) {
            toast.error(`Error updating cohort ${resp.error}`);
        } else {
            toast.success("Cohort updated successfully");
        }
        setSubmitLoading(false);
    };

    const methods = useForm<ActionUpdateSeminarCohortInput>({
        values: {
            id: seminarCohort.id,
            seminarOnlyPrice: seminarCohort.seminarOnlyPrice,
            seminarUpgradePrice: seminarCohort.seminarUpgradePrice,
        },
    });

    return (
        <FormProvider {...methods}>
            <form
                className="flex flex-col max-w-lg"
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                <p className="font-semibold text-xs dark:text-gray-300 text-gray-600">
                    ⚠️ Price is in <b>cents</b>, so be sure to add two extra 00
                    at the end
                </p>
                <NumberInput
                    label="Seminar Only price* (in cents) - The price for repeat purchases of seminars"
                    name="seminarOnlyPrice"
                    options={{ valueAsNumber: true, required: true }}
                />
                <NumberInput
                    label="Seminar Upgrade Price* (in cents) - The price for upgrading to current seminar tier for base purchases"
                    name="seminarUpgradePrice"
                    options={{ valueAsNumber: true, required: true }}
                />
                <SubmitInput
                    value={"Update pricing for this cohort"}
                    isLoading={submitLoading}
                />
            </form>
            {/* <div className="my-12">
                <button
                    className="d-btn d-btn-warning d-btn-xs m-2 border-dotted border-2 border-black hover:border-solid hover:border-black hover:border-2 duration-200"
                    onClick={() => {
                        console.info(methods.getValues());
                    }}
                >
                    DEBUG: Get form values
                </button>
            </div> */}
        </FormProvider>
    );
};
