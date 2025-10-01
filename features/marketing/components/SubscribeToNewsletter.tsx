"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CardShell } from "lib/components/ui/CardShell";
import { useState, useTransition } from "react";
import { actionSubscribeToNewsletter } from "../server/actions";
import { Button } from "@mui/material";

type FormData = {
    email: string;
};

export const SubscribeToNewsletter = () => {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        setStatus("loading");

        startTransition(async () => {
            try {
                const result = await actionSubscribeToNewsletter(data.email);

                if (result.success) {
                    setStatus("success");
                    toast.success(result.message);
                } else {
                    setStatus("error");
                    toast.error(result.message);
                }
            } catch {
                setStatus("error");
                toast.error("Failed to subscribe");
            }
        });
    };
    return (
        <div className="py-2">
            <CardShell>
                <div className="p-2 sm:p-10">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex justify-center flex-wrap gap-2"
                    >
                        <div className="form-group">
                            <input
                                disabled={isPending || status === "success"}
                                placeholder={
                                    (status === "idle" && "Enter your email") ||
                                    (status === "success" && "Thank you!") ||
                                    ""
                                }
                                id="email"
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email address",
                                    },
                                })}
                                className="p-2 border border-gray-400 rounded-md text-slate-800 dark:text-slate-300"
                            />
                        </div>
                        <Button
                            disabled={isPending || status === "success"}
                            type="submit"
                            variant="contained"
                            className={status === "error" ? "!bg-red-500" : ""}
                        >
                            {status === "error" && "Error. Retry"}
                            {status === "idle" && "Subscribe"}
                            {status === "loading" && "Subscribing..."}
                            {status === "success" && "Subscribed!"}
                        </Button>
                    </form>
                    <div className="h-3 p-1 flex justify-center">
                        {errors.email && (
                            <p className="error-message text-red-400">
                                {errors.email.message?.toString()}
                            </p>
                        )}
                        {status === "success" && (
                            <p className="success-message text-purple-800 dark:text-acid-green text-center">
                                Thank you for subscribing! 🦉
                            </p>
                        )}
                    </div>
                </div>
            </CardShell>
        </div>
    );
};
