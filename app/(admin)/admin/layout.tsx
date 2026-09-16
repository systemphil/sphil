import { auth } from "lib/auth/authConfig";
import { AdminNav } from "lib/components/navigation/AdminNav";
import { notFound } from "next/navigation";
import { connection } from "next/server";

export const metadata = {};

/**
 * The layout gates every /admin/** route on the session, so there is no
 * meaningful static shell to ship ahead of that check — rendering the admin
 * chrome before knowing the viewer is an admin would be wrong. Opt the segment
 * out of instant-navigation validation and let it block instead.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/instant
 */
export const instant = false;

/**
 * AdminLayout controls the access and UI for /admin/**
 */
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    /**
     * NextAuth reads the current time (to check session expiry) after reading
     * headers, which Cache Components flags during prerendering. Marking the
     * segment as per-request first makes that time read legitimate, and covers
     * every /admin/** page below (e.g. relative "edited ago" times).
     * @see https://nextjs.org/docs/messages/blocking-prerender-current-time
     */
    await connection();
    const session = await auth();

    if (
        !session ||
        !(session.user.role === "ADMIN" || session.user.role === "SUPERADMIN")
    ) {
        return notFound();
    }

    return (
        <section data-pagefind-ignore>
            <AdminNav role={session.user.role} />
            {children}
        </section>
    );
}
