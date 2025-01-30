"use client";

import {
    AutoFixHighOutlined,
    ConstructionOutlined,
    EngineeringOutlined,
    InfoOutlined,
    WarningAmberOutlined,
} from "@mui/icons-material";
import { FadeIn } from "../animations/FadeIn";
import { useEffect, useState } from "react";

type SeverityProps = "info" | "warning" | "critical" | "success" | "beta";

export function MaintenanceStatic({
    severity,
    message,
}: {
    severity: SeverityProps;
    message: string;
}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Prevent hydration mismatch by only rendering once mounted
    if (!isMounted) {
        return null;
    }

    const title = getMaintenanceTitle(severity);
    const classes = getMaintenanceClasses(severity);

    return (
        <FadeIn>
            <div className="md:px-10 max-w-[900px]">
                <div
                    className={`relative flex flex-col radius-md rounded-sm shadow-xl bg-linear-to-b ${classes} transition duration-300  md:bg-linear-to-bl`}
                >
                    <div className="flex flex-col items-center justify-center p-6 gap-1">
                        <div className="flex items-center text-lg justify-center">
                            {getMaintenanceIcon(severity)}
                            <p className="text-2xl lg:text-4xl font-bold pl-2 pr-0 pt-0 pb-0 m-0">
                                {title}
                            </p>
                        </div>
                        <p className="text-slate-900 dark:text-slate-200 pt-4 text-justify">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </FadeIn>
    );
}
function getMaintenanceTitle(severity: SeverityProps) {
    switch (severity) {
        case "info":
            return "News";
        case "warning":
            return "Maintenance";
        case "critical":
            return "Important Maintenance";
        case "success":
            return "New Features";
        case "beta":
            return "Active Development";
    }
}
function getMaintenanceClasses(severity: SeverityProps) {
    switch (severity) {
        case "info":
            return "from-purple-300/90 to-purple-400/90 dark:from-purple-950/90 dark:to-purple-800/90";
        case "warning":
            return "from-orange-400/90 to-orange-500/90 dark:from-orange-950/90 dark:to-orange-800/90";
        case "critical":
            return "from-red-400/90 to-red-500/90 dark:from-red-950/90 dark:to-red-800/90";
        case "success":
            return "from-emerald-300/90 to-emerald-400/90 dark:from-emerald-950/90 dark:to-emerald-800/90";
        case "beta":
            return "from-rose-300/90 to-rose-400/90 dark:from-rose-950/90 dark:to-rose-800/90";
    }
}
function getMaintenanceIcon(severity: SeverityProps) {
    switch (severity) {
        case "info":
            return <InfoOutlined fontSize="large" />;
        case "warning":
            return <WarningAmberOutlined fontSize="large" />;
        case "critical":
            return <EngineeringOutlined fontSize="large" />;
        case "success":
            return <AutoFixHighOutlined fontSize="large" />;
        case "beta":
            return <ConstructionOutlined fontSize="large" />;
    }
}
