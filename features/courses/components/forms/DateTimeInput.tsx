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
        formState: { errors },
    } = useFormContext();

    return (
        <Field>
            <Label htmlFor={name}>{label}</Label>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    name={name}
                    rules={options}
                    render={({ field }) => (
                        <DateTimePicker
                            value={field.value ? dayjs(field.value) : null}
                            onChange={(date) => field.onChange(date)}
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
