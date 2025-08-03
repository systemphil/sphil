"use client";

import clsx from "clsx";

type Props = {
    value: string;
    isLoading: boolean;
    isVerbose?: boolean;
};

export const SubmitInput = ({ value, isLoading, isVerbose = false }: Props) => {
    const classes = clsx({
        "d-btn d-btn-primary": true,
        "": !isLoading,
        "d-btn-disabled": isLoading,
    });

    const label = isLoading ? "Loading..." : value;

    return (
        <div>
            <button
                className={classes}
                type="submit"
                value={label}
                disabled={isLoading}
            >
                {isLoading && (
                    <span className="loading loading-bars loading-md">
                        {isVerbose && "May take 1-2mins"}
                    </span>
                )}
                {label}
            </button>
        </div>
    );
};
