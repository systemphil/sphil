"use client";

import {
    Button,
    Chip,
    Divider,
    IconButton,
    MenuItem,
    Popover,
    TextField,
    Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import {
    actionGrantCourse,
    actionGrantSeminarCohort,
    actionRevokeCourseGrant,
    actionRevokeSeminarCohortGrant,
} from "../server/actions";
import type { GrantOptions, ManagedUser } from "./UsersTable";

type ActionResult = { error: boolean; message: string };

const plural = (count: number, word: string) =>
    `${count} ${word}${count === 1 ? "" : "s"}`;

const personName = (person: { name: string | null; email: string } | null) =>
    person ? (person.name ?? person.email) : "a former admin";

/** MUI menus lock body scroll, which jolts the page; see UsersTable. */
const SELECT_SLOT_PROPS = {
    select: { MenuProps: { disableScrollLock: true } },
} as const;

/**
 * Course titles can be long, so the cell only summarises counts. The popover
 * lists everything in full and lets a super admin grant or revoke access by
 * hand. Only manual grants can be revoked; paid access is managed in Stripe.
 */
export function PurchasesCell({
    user,
    options,
}: {
    user: ManagedUser;
    options: GrantOptions;
}) {
    const router = useRouter();
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);
    const [pendingKey, setPendingKey] = useState<string | null>(null);
    const [confirmKey, setConfirmKey] = useState<string | null>(null);
    const [courseToGrant, setCourseToGrant] = useState("");
    const [cohortToGrant, setCohortToGrant] = useState("");

    const { purchases, seminarCohorts, seminarCohortGrants } = user;
    const grantsByCohort = new Map(
        seminarCohortGrants.map((grant) => [grant.seminarCohortId, grant])
    );

    const ownedCourseIds = new Set(purchases.map((p) => p.course.id));
    const joinedCohortIds = new Set(seminarCohorts.map((c) => c.id));
    const grantableCourses = options.courses.filter(
        (course) => !ownedCourseIds.has(course.id)
    );
    const grantableCohorts = options.seminarCohorts.filter(
        (cohort) => !joinedCohortIds.has(cohort.id)
    );

    const summary =
        [
            purchases.length > 0 && plural(purchases.length, "course"),
            seminarCohorts.length > 0 &&
                plural(seminarCohorts.length, "seminar"),
        ]
            .filter(Boolean)
            .join(" · ") || "None";

    const run = async (
        key: string,
        action: () => Promise<ActionResult>,
        success: string
    ) => {
        setPendingKey(key);
        const resp = await action();
        setPendingKey(null);
        setConfirmKey(null);

        if (resp.error) {
            toast.error(resp.message);
            return false;
        }

        toast.success(success);
        router.refresh();
        return true;
    };

    const handleRevoke = (key: string, revoke: () => Promise<ActionResult>) => {
        // Two clicks: the first arms the button, the second revokes.
        if (confirmKey !== key) {
            setConfirmKey(key);
            return;
        }
        run(key, revoke, "Access removed");
    };

    return (
        <>
            <Button
                size="small"
                color={summary === "None" ? "inherit" : "primary"}
                onClick={(e) => setAnchor(e.currentTarget)}
                // Keep grid keyboard navigation from swallowing Enter/Space.
                onKeyDown={(e) => e.stopPropagation()}
                sx={{
                    textTransform: "none",
                    px: 1,
                    ml: -1,
                    ...(summary === "None" && { color: "text.disabled" }),
                }}
            >
                {summary}
            </Button>
            <Popover
                open={anchor !== null}
                anchorEl={anchor}
                onClose={() => {
                    setAnchor(null);
                    setConfirmKey(null);
                }}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                // Modal scroll lock shifts the page as the scrollbar disappears.
                disableScrollLock
                // The popover is portalled but React events still bubble to the
                // grid cell, whose key handling would eat typing and Space here.
                onKeyDown={(e) => e.stopPropagation()}
                slotProps={{ paper: { sx: { width: 420, maxWidth: "95vw" } } }}
            >
                <div className="flex flex-col gap-3 p-3 text-sm">
                    {purchases.length === 0 && seminarCohorts.length === 0 && (
                        <p className="text-neutral-500">No courses or seminars.</p>
                    )}

                    {purchases.length > 0 && (
                        <Section title="Courses">
                            {purchases.map((purchase) => {
                                const key = `course:${purchase.course.id}`;
                                const manual = purchase.source === "MANUAL";
                                return (
                                    <AccessRow
                                        key={key}
                                        name={purchase.course.name}
                                        detail={
                                            manual
                                                ? `Granted ${purchase.createdAt.toLocaleDateString()} by ${personName(purchase.grantedBy)}`
                                                : `Purchased ${purchase.createdAt.toLocaleDateString()}`
                                        }
                                        manual={manual}
                                        confirming={confirmKey === key}
                                        pending={pendingKey === key}
                                        onRevoke={() =>
                                            handleRevoke(key, () =>
                                                actionRevokeCourseGrant({
                                                    userId: user.id,
                                                    courseId: purchase.course.id,
                                                })
                                            )
                                        }
                                    />
                                );
                            })}
                        </Section>
                    )}

                    {seminarCohorts.length > 0 && (
                        <Section title="Seminars">
                            {seminarCohorts.map((cohort) => {
                                const key = `cohort:${cohort.id}`;
                                const grant = grantsByCohort.get(cohort.id);
                                return (
                                    <AccessRow
                                        key={key}
                                        name={cohort.course.name}
                                        detail={
                                            grant
                                                ? `${cohort.year} cohort · Granted ${grant.createdAt.toLocaleDateString()} by ${personName(grant.grantedBy)}`
                                                : `${cohort.year} cohort`
                                        }
                                        manual={grant !== undefined}
                                        confirming={confirmKey === key}
                                        pending={pendingKey === key}
                                        onRevoke={() =>
                                            handleRevoke(key, () =>
                                                actionRevokeSeminarCohortGrant({
                                                    userId: user.id,
                                                    seminarCohortId: cohort.id,
                                                })
                                            )
                                        }
                                    />
                                );
                            })}
                        </Section>
                    )}

                    <Divider />

                    <Section title="Grant access">
                        <GrantRow
                            label="Course"
                            value={courseToGrant}
                            onChange={setCourseToGrant}
                            options={grantableCourses.map((course) => ({
                                value: course.id,
                                label: course.name,
                            }))}
                            emptyLabel="Has every course"
                            buttonLabel="Grant"
                            pending={pendingKey === "grant:course"}
                            onSubmit={async () => {
                                const ok = await run(
                                    "grant:course",
                                    () =>
                                        actionGrantCourse({
                                            userId: user.id,
                                            courseId: courseToGrant,
                                        }),
                                    "Course granted"
                                );
                                if (ok) setCourseToGrant("");
                            }}
                        />
                        <GrantRow
                            label="Seminar cohort"
                            value={cohortToGrant}
                            onChange={setCohortToGrant}
                            options={grantableCohorts.map((cohort) => ({
                                value: cohort.id,
                                label: `${cohort.course.name} · ${cohort.year}`,
                            }))}
                            emptyLabel="No other cohorts"
                            buttonLabel="Add"
                            pending={pendingKey === "grant:cohort"}
                            onSubmit={async () => {
                                const ok = await run(
                                    "grant:cohort",
                                    () =>
                                        actionGrantSeminarCohort({
                                            userId: user.id,
                                            seminarCohortId: cohortToGrant,
                                        }),
                                    "Added to seminar cohort"
                                );
                                if (ok) setCohortToGrant("");
                            }}
                        />
                    </Section>
                </div>
            </Popover>
        </>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-2">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                {title}
            </h3>
            <ul className="flex flex-col gap-2">{children}</ul>
        </section>
    );
}

function AccessRow({
    name,
    detail,
    manual,
    confirming,
    pending,
    onRevoke,
}: {
    name: string;
    detail: string;
    manual: boolean;
    confirming: boolean;
    pending: boolean;
    onRevoke: () => void;
}) {
    return (
        <li className="flex items-start gap-2">
            <div className="flex min-w-0 flex-1 flex-col">
                <span className="leading-snug">
                    {name}
                    {manual && (
                        <Chip
                            label="manual"
                            size="small"
                            variant="outlined"
                            sx={{ ml: 1, height: 18, fontSize: 10 }}
                        />
                    )}
                </span>
                <span className="text-xs text-neutral-500">{detail}</span>
            </div>
            {manual &&
                (confirming ? (
                    <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={onRevoke}
                        disabled={pending}
                        sx={{ flexShrink: 0, textTransform: "none" }}
                    >
                        Remove
                    </Button>
                ) : (
                    <Tooltip title="Remove access">
                        <IconButton
                            size="small"
                            aria-label={`Remove access to ${name}`}
                            onClick={onRevoke}
                            disabled={pending}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                ))}
        </li>
    );
}

function GrantRow({
    label,
    value,
    onChange,
    options,
    emptyLabel,
    buttonLabel,
    pending,
    onSubmit,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    emptyLabel: string;
    buttonLabel: string;
    pending: boolean;
    onSubmit: () => void;
}) {
    return (
        <li className="flex items-center gap-2">
            <TextField
                select
                size="small"
                label={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={options.length === 0 || pending}
                helperText={options.length === 0 ? emptyLabel : undefined}
                slotProps={SELECT_SLOT_PROPS}
                sx={{ flex: 1, minWidth: 0 }}
            >
                {options.map((option) => (
                    <MenuItem
                        key={option.value}
                        value={option.value}
                        sx={{ whiteSpace: "normal" }}
                    >
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
            <Button
                variant="contained"
                size="small"
                onClick={onSubmit}
                disabled={!value || pending}
                sx={{ flexShrink: 0, alignSelf: "flex-start", mt: 0.5 }}
            >
                {buttonLabel}
            </Button>
        </li>
    );
}
