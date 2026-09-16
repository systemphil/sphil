"use client";

import { Chip, ThemeProvider, type Theme, createTheme } from "@mui/material";
import {
    DataGrid,
    GridEditSingleSelectCell,
    type GridColDef,
    type GridFilterModel,
    type GridPaginationModel,
    type GridRenderEditCellParams,
    type GridRowId,
    type GridSortModel,
    useGridApiContext,
} from "@mui/x-data-grid";
import type { PurchaseSource, Role } from "@prisma/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import type { UsersSortField } from "lib/database/dbFuncs";
import { actionUpdateUserRole } from "../server/actions";
import { PurchasesCell } from "./PurchasesCell";

export type ManagedUser = {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    emailVerified: Date | null;
    createdAt: Date;
    purchases: {
        createdAt: Date;
        source: PurchaseSource;
        grantedBy: GrantPerson;
        course: { id: string; name: string };
    }[];
    seminarCohorts: {
        id: string;
        year: number;
        course: { name: string };
    }[];
    /** Present only for cohorts the user was added to by hand. */
    seminarCohortGrants: {
        seminarCohortId: string;
        createdAt: Date;
        grantedBy: GrantPerson;
    }[];
};

type GrantPerson = { name: string | null; email: string } | null;

export type GrantOptions = {
    courses: { id: string; name: string }[];
    seminarCohorts: { id: string; year: number; course: { name: string } }[];
};

const ROLES: Role[] = ["BASIC", "ADMIN", "SUPERADMIN"];

const ROLE_COLORS: Record<Role, "default" | "primary" | "secondary"> = {
    BASIC: "default",
    ADMIN: "primary",
    SUPERADMIN: "secondary",
};

const QUICK_FILTER_DEBOUNCE_MS = 300;

/**
 * The role dropdown is a Modal, which locks body scroll and pads the gap where
 * the scrollbar was, so the page jumps as it opens and again as it closes.
 *
 * It can't be switched off per-grid: the grid's `baseSelect` slot builds its
 * own `MenuProps` and applies them after any it is handed, and the one prop
 * that does win (`material`) would replace the menu's internally supplied
 * `onClose` — leaving a controlled-open menu that can't be dismissed. Setting
 * the default on the Menu component itself sidesteps that composition, and
 * merging onto the outer theme keeps it scoped to this grid rather than every
 * menu in the app.
 */
const gridTheme = (outerTheme: Theme) =>
    createTheme(outerTheme, {
        components: {
            MuiMenu: { defaultProps: { disableScrollLock: true } },
        },
    });

/**
 * The stock single-select edit cell writes the value but leaves the cell in
 * edit mode, so `processRowUpdate` only runs once the cell loses focus — the
 * change appears to do nothing until you click elsewhere. `onValueChange` runs
 * immediately after the value is set, so closing edit mode there commits the
 * pick on selection.
 */
function RoleEditCell(props: GridRenderEditCellParams<ManagedUser>) {
    const apiRef = useGridApiContext();

    return (
        <GridEditSingleSelectCell
            {...props}
            onValueChange={() => {
                apiRef.current.stopCellEditMode({
                    id: props.id,
                    field: props.field,
                });
            }}
        />
    );
}

export function UsersTable({
    users,
    total,
    page,
    pageSize,
    sortField,
    sortDirection,
    search,
    currentUserId,
    grantOptions,
}: {
    users: ManagedUser[];
    total: number;
    page: number;
    pageSize: number;
    sortField: UsersSortField;
    sortDirection: "asc" | "desc";
    search: string;
    currentUserId: string;
    grantOptions: GrantOptions;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, setIsPending] = useState(false);

    /**
     * The grid is fed entirely from the URL, so every interaction below
     * rewrites the query string and lets the server component re-query.
     */
    const pushParams = useCallback(
        (changes: Record<string, string | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            for (const [key, value] of Object.entries(changes)) {
                if (value === null || value === "") {
                    params.delete(key);
                } else {
                    params.set(key, value);
                }
            }

            const query = params.toString();
            router.push(query ? `${pathname}?${query}` : pathname);
        },
        [pathname, router, searchParams]
    );

    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(
        () => () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        },
        []
    );

    const handleFilterModelChange = useCallback(
        (model: GridFilterModel) => {
            const next = (model.quickFilterValues ?? []).join(" ").trim();

            if (next === search) return;

            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                // Any change to the filter invalidates the current offset.
                pushParams({ q: next || null, page: null });
            }, QUICK_FILTER_DEBOUNCE_MS);
        },
        [pushParams, search]
    );

    const handlePaginationModelChange = useCallback(
        (model: GridPaginationModel) => {
            pushParams({
                page: model.page === 0 ? null : String(model.page + 1),
                pageSize:
                    model.pageSize === 25 ? null : String(model.pageSize),
            });
        },
        [pushParams]
    );

    const handleSortModelChange = useCallback(
        (model: GridSortModel) => {
            const item = model[0];

            if (!item?.sort) {
                pushParams({ sort: null, dir: null, page: null });
                return;
            }

            pushParams({ sort: item.field, dir: item.sort, page: null });
        },
        [pushParams]
    );

    const processRowUpdate = useCallback(
        async (newRow: ManagedUser, oldRow: ManagedUser) => {
            if (newRow.role === oldRow.role) return oldRow;

            setIsPending(true);
            const resp = await actionUpdateUserRole({
                userId: newRow.id,
                role: newRow.role,
            });
            setIsPending(false);

            if (resp.error) {
                // Thrown so the grid reverts the cell and calls the error handler.
                throw new Error(resp.message);
            }

            toast.success(`Role updated to ${newRow.role}`);
            router.refresh();

            return newRow;
        },
        [router]
    );

    const columns: GridColDef<ManagedUser>[] = [
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            minWidth: 160,
            renderCell: (params) => (
                <span>
                    {params.row.name ?? "—"}
                    {params.row.id === currentUserId && (
                        <Chip label="you" size="small" sx={{ ml: 1 }} />
                    )}
                </span>
            ),
        },
        {
            field: "email",
            headerName: "Email",
            flex: 1.4,
            minWidth: 220,
            renderCell: (params) => (
                <span>
                    {params.row.email}
                    {!params.row.emailVerified && (
                        <Chip
                            label="unverified"
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ ml: 1 }}
                        />
                    )}
                </span>
            ),
        },
        {
            field: "createdAt",
            headerName: "Joined",
            width: 130,
            valueFormatter: (value: Date) => value.toLocaleDateString(),
        },
        {
            field: "purchases",
            headerName: "Purchases",
            flex: 1,
            minWidth: 170,
            sortable: false,
            renderCell: (params) => (
                <PurchasesCell user={params.row} options={grantOptions} />
            ),
        },
        {
            field: "role",
            headerName: "Role",
            width: 170,
            editable: true,
            type: "singleSelect",
            valueOptions: ROLES,
            cellClassName: "users-grid--role-cell",
            renderEditCell: (params) => <RoleEditCell {...params} />,
            renderCell: (params) => (
                <Chip
                    label={params.row.role}
                    size="small"
                    color={ROLE_COLORS[params.row.role]}
                />
            ),
        },
    ];

    return (
        <ThemeProvider theme={gridTheme}>
            <DataGrid<ManagedUser>
                rows={users}
                columns={columns}
                getRowId={(row: ManagedUser) => row.id}
                showToolbar
                loading={isPending}
                // The grid only ever holds one page, so every operation is server-side.
                paginationMode="server"
                filterMode="server"
                sortingMode="server"
                rowCount={total}
                paginationModel={{ page: page - 1, pageSize }}
                onPaginationModelChange={handlePaginationModelChange}
                pageSizeOptions={[25, 50, 100]}
                sortModel={[{ field: sortField, sort: sortDirection }]}
                onSortModelChange={handleSortModelChange}
                filterModel={{
                    items: [],
                    /**
                     * Must match the quick filter's own parser (split on space,
                     * empties dropped). If it doesn't deep-equal what the input
                     * parses to, the grid treats the model as an external change
                     * and resets the box mid-typing.
                     */
                    quickFilterValues: search
                        ? search.split(" ").filter(Boolean)
                        : [],
                }}
                onFilterModelChange={handleFilterModelChange}
                // Column filters would need per-field server support; quick search only.
                disableColumnFilter
                disableRowSelectionOnClick
                /** A super admin cannot change their own role, so that cell stays read-only. */
                isCellEditable={(params: { id: GridRowId }) =>
                    params.id !== currentUserId
                }
                processRowUpdate={processRowUpdate}
                onProcessRowUpdateError={(err: Error) => toast.error(err.message)}
                sx={{
                    minHeight: 400,
                    /**
                     * Entering edit mode leaves the browser's selection range over
                     * the cell, so the chip's label renders highlighted after a
                     * pick. Scoped to this column so the name and email cells stay
                     * selectable for copying.
                     */
                    "& .users-grid--role-cell": { userSelect: "none" },
                }}
            />
        </ThemeProvider>
    );
}
