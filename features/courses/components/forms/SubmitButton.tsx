"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            aria-disabled={pending}
            className="d-btn d-btn-primary"
            disabled={pending}
        >
            {children}
        </button>
    );
}
