import { auth } from "lib/auth/authConfig";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    const session = await auth();

    if (
        !session ||
        !(session.user.role === "ADMIN" || session.user.role === "SUPERADMIN")
    ) {
        return notFound();
    }

    const isSudo = session.user.role === "SUPERADMIN";

    return (
        <section data-pagefind-ignore>
            <div className="w-full bg-purple-200 z-1 fixed shadow-sm flex justify-center items-center py-1 gap-3">
                <span className="text-purple-300">ADMIN AREA</span>
                <Link href="/admin">Main</Link>
                <Link href="/admin/mng">Management</Link>
                {isSudo && <Link href="/admin/users">Users</Link>}
                <span className="text-purple-300">ADMIN AREA</span>
            </div>
            <div className="pt-12">{children}</div>
        </section>
    );
}
