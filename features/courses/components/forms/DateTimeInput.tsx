"use client";

import { useFormContext, Controller, RegisterOptions } from "react-hook-form";
import { Field } from "./Field";
import { Label } from "./Label";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

type Props = {
    name: string;
    label: string;
    options: RegisterOptions;
};

export const DateTimeInput = ({ name, label, options }: Props) => {
    const {
        control,
        formState: { errors },
    } = useFormContext();

    return (
        <Field>
            <Label htmlFor={name}>{label}</Label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    name={name}
                    control={control}
                    rules={options}
                    render={({ field }) => (
                        <DateTimePicker
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(newValue) => {
                                // Convert to UTC ISO string when saving to form
                                const utcValue = newValue
                                    ? newValue.toISOString()
                                    : null;
                                field.onChange(utcValue);
                            }}
                            slots={{ textField: TextField }}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !!errors[name],
                                    className: "bg-white rounded-sm mb-2",
                                    size: "small",
                                },
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
            {errors[name] && (
                <span className="text-red-600 text-sm">{name} is required</span>
            )}
        </Field>
    );
};
