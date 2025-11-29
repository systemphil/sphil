import { auth } from "lib/auth/authConfig";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic"; // Next.js flags that disables all caching of fetch requests and always invalidates routes on /admin/*

export const metadata = {};
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

    return (
        <section data-pagefind-ignore>
            <div className="w-full bg-purple-200 z-1 fixed shadow-sm flex justify-center items-center py-1 gap-3">
                <span className="text-purple-300">ADMIN AREA</span>
                <Link href="/admin">Main</Link>
                <Link href="/admin/mng">Management</Link>
                <span className="text-purple-300">ADMIN AREA</span>
            </div>
            <div className="pt-12">{children}</div>
        </section>
    );
}
