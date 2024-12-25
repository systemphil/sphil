"use client";

import { useFormContext, RegisterOptions } from "react-hook-form";
import { Field } from "./Field";
import { Label } from "./Label";

type Props = {
    name: string;
    label: string;
    options?: RegisterOptions;
};

export const Checkbox = ({ name, label, options = {} }: Props) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <Field>
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    className="border-gray-200 mb-1 block"
                    {...register(name, options)}
                />
                <Label htmlFor={name}>{label}</Label>
            </div>
        </Field>
    );
};
