"use client";

import { Button } from "@mui/material";
import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            aria-disabled={pending}
            variant="contained"
            disabled={pending}
        >
            {children}
        </Button>
    );
}
