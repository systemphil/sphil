"use client";

import { Button } from "@mui/material";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            aria-disabled={pending}
            disabled={pending}
            variant="contained"
        >
            {children}
        </Button>
    );
}
