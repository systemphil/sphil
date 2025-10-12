"use client";

import { Button } from "@mui/material";

type Props = {
    value: string;
    isLoading: boolean;
    isVerbose?: boolean;
};

export const SubmitInput = ({ value, isLoading, isVerbose = false }: Props) => {
    const label = isLoading ? "Loading..." : value;

    return (
        <div>
            <Button
                variant="contained"
                type="submit"
                value={label}
                disabled={isLoading}
            >
                {isLoading && (
                    <span className="loading loading-bars loading-md" />
                )}
                {label}
                {isLoading && isVerbose && "...may take 1-2mins ☕"}
            </Button>
        </div>
    );
};
