"use client";

import clsx from "clsx";

type Props = {
    value: string;
    isLoading: boolean;
};

export const SubmitInput = ({ value, isLoading }: Props) => {
    const classes = clsx({
        "btn btn-primary": true,
        "": !isLoading,
        "btn-disabled": isLoading,
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
                    <span className="loading loading-bars loading-md"></span>
                )}
                {label}
            </button>
        </div>
    );
};
