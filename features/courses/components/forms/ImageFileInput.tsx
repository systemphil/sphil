"use client";

import { useFormContext, RegisterOptions } from "react-hook-form";
import { Field } from "./Field";
import { Label } from "./Label";

type Props = {
    name: string;
    label: string;
    options: RegisterOptions;
};

export const ImageFileInput = ({ name, label, options }: Props) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <Field>
            <Label htmlFor={name}>{label}</Label>
            <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="border border-gray-200 p-2 rounded-sm mb-2 text-slate-700 dark:text-slate-200"
                {...register(name, options)}
            />
            {errors[name] && (
                <span className="text-red-600 text-sm">{name} is required</span>
            )}
        </Field>
    );
};
