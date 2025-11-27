import type { $Enums } from "@prisma/client";
import {
    AutoFixHighOutlined,
    ConstructionOutlined,
    EngineeringOutlined,
    InfoOutlined,
    WarningAmberOutlined,
} from "@mui/icons-material";
import {
    cache,
    CACHE_REVALIDATION_INTERVAL_MAINTENANCE,
} from "lib/server/cache";
import {
    dbGetMaintenanceMessageGlobal,
    dbGetMaintenanceMessageUser,
} from "lib/database/dbFuncs";
import { Heading } from "./ui/Heading";
import { FadeIn } from "./animations/FadeIn";
import { Card, CardContent } from "@mui/material";

export async function Maintenance({
    area,
    componentToDisplayForBeta,
}: {
    area: "global" | "user";
    componentToDisplayForBeta?: React.ReactNode | undefined;
}) {
    const getMaintenanceMsgGlobal = cache(
        async () => {
            return await dbGetMaintenanceMessageGlobal();
        },
        ["/maintenance_global"],
        { revalidate: CACHE_REVALIDATION_INTERVAL_MAINTENANCE }
    );
    const getMaintenanceMsgUser = cache(
        async () => {
            return await dbGetMaintenanceMessageUser();
        },
        ["/maintenance_user"],
        { revalidate: CACHE_REVALIDATION_INTERVAL_MAINTENANCE }
    );

    const maintenance =
        area === "global"
            ? await getMaintenanceMsgGlobal()
            : await getMaintenanceMsgUser();

    if (maintenance) {
        const title = getMaintenanceTitle(maintenance.severity);
        const classes = getMaintenanceClasses(maintenance.severity);

        if (area === "user")
            return (
                <div className="md:px-10 max-w-[900px] mt-10 md:mt-32">
                    <Card
                        className={`!bg-linear-to-b ${classes} transition duration-300  md:!bg-linear-to-bl`}
                    >
                        <CardContent>
                            <div className="justify-center">
                                {getMaintenanceIcon(maintenance.severity)}
                                <Heading as="h3">{title}</Heading>
                            </div>
                            <p className="!text-slate-900 dark:!text-slate-400 pt-4 text-justify">
                                {maintenance.message}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            );
        return (
            <FadeIn>
                <div className="md:px-10 max-w-[900px] mt-10 md:mt-32">
                    <Card
                        className={`!bg-linear-to-b ${classes} transition duration-300  md:!bg-linear-to-bl`}
                    >
                        <CardContent>
                            <div className="justify-center">
                                {getMaintenanceIcon(maintenance.severity)}
                                <Heading as="h3">{title}</Heading>
                            </div>
                            <p className="text-slate-900 dark:text-slate-300 text-md pt-4 text-justify">
                                {maintenance.message}
                            </p>
                            {maintenance.severity === "beta" && (
                                <div className="flex flex-col justify-center items-center">
                                    {componentToDisplayForBeta ?? null}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </FadeIn>
        );
    }

    return null;
}

function getMaintenanceTitle(severity: $Enums.MaintenanceSeverity) {
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
function getMaintenanceClasses(severity: $Enums.MaintenanceSeverity) {
    switch (severity) {
        case "info":
            return "!from-purple-300/90 !to-purple-400/90 dark:!from-purple-950/90 dark:!to-purple-800/90";
        case "warning":
            return "!from-orange-400/90 !to-orange-500/90 dark:!from-orange-950/90 dark:!to-orange-800/90";
        case "critical":
            return "!from-red-400/90 !to-red-500/90 dark:!from-red-950/90 dark:!to-red-800/90";
        case "success":
            return "!from-emerald-300/90 !to-emerald-400/90 dark:!from-emerald-950/90 dark:!to-emerald-800/90";
        case "beta":
            return "!from-rose-300/90 !to-rose-400/90 dark:!from-rose-950/90 dark:!to-rose-800/90";
    }
}
function getMaintenanceIcon(severity: $Enums.MaintenanceSeverity) {
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
