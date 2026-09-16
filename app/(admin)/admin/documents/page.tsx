import { TextField } from "@mui/material";
import Link from "next/link";
import { Heading } from "lib/components/ui/Heading";
import { PageWrapper } from "lib/components/ui/PageWrapper";
import { dbGetAdminDocuments } from "lib/database/dbFuncs";
import { NewDocumentButton } from "features/documents/components/NewDocumentButton";
import {
    formatEditedAt,
    relativeTime,
} from "features/documents/utils/formatEditedAt";
import { cn } from "lib/utils";

export const metadata = {};

/**
 * Reads admin-gated data and searchParams on every request, so there is no
 * static shell to validate. `instant = false` on the parent layout does not
 * cover descendants.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

/**
 * Internal documents for admins, most recently edited first. `?view=archived`
 * lists archived documents instead of active ones.
 */
export default async function AdminDocumentsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; view?: string }>;
}) {
    const { q, view } = await searchParams;
    const search = q?.trim() ?? "";
    const archived = view === "archived";
    const documents = await dbGetAdminDocuments({
        search: search || undefined,
        archived,
    });

    const viewHref = (next: "active" | "archived") => {
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        if (next === "archived") params.set("view", "archived");
        const query = params.toString();
        return query ? `/admin/documents?${query}` : "/admin/documents";
    };

    return (
        <PageWrapper className="py-6 gap-6">
            <div className="w-full max-w-3xl flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <Heading as="h2">Documents</Heading>
                    <NewDocumentButton />
                </div>

                <div className="flex w-fit gap-1 rounded-lg bg-neutral-100 p-1 text-sm dark:bg-neutral-800">
                    {(["active", "archived"] as const).map((option) => {
                        const selected = (option === "archived") === archived;
                        return (
                            <Link
                                key={option}
                                href={viewHref(option)}
                                aria-current={selected ? "page" : undefined}
                                className={cn(
                                    "rounded-md px-3 py-1 capitalize text-neutral-600 transition-colors hover:text-black dark:text-neutral-400 dark:hover:text-neutral-100",
                                    selected &&
                                        "bg-white font-medium text-black shadow-sm dark:bg-neutral-900 dark:text-neutral-100"
                                )}
                            >
                                {option}
                            </Link>
                        );
                    })}
                </div>

                {/* Plain GET form: submitting rewrites ?q= and the page re-queries. */}
                <form action="/admin/documents">
                    {archived && (
                        <input type="hidden" name="view" value="archived" />
                    )}
                    <TextField
                        name="q"
                        type="search"
                        defaultValue={search}
                        placeholder="Search by title…"
                        size="small"
                        fullWidth
                        slotProps={{
                            htmlInput: { "aria-label": "Search documents" },
                        }}
                    />
                </form>

                {documents.length === 0 ? (
                    <p className="py-10 text-center text-neutral-500">
                        {search
                            ? `No ${archived ? "archived " : ""}documents match “${search}”.`
                            : archived
                              ? "No archived documents."
                              : "No documents yet."}
                    </p>
                ) : (
                    <ul className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-700">
                        {documents.map((document) => (
                            <li key={document.id}>
                                <Link
                                    href={`/admin/documents/${document.id}`}
                                    className="flex flex-col gap-0.5 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                                >
                                    <span className="font-medium">
                                        {document.title}
                                    </span>
                                    <span className="text-xs text-neutral-500">
                                        {formatEditedAt(
                                            document.updatedAt.toISOString(),
                                            document.lastEditor
                                        )}
                                        {document.archivedAt &&
                                            ` · Archived ${relativeTime(document.archivedAt.toISOString())}`}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </PageWrapper>
    );
}
