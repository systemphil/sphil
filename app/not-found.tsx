import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Page Not Found",
};

export default function NotFound() {
    return (
        <div className="mx-auto flex max-w-(--docs-content-width) flex-col items-center gap-4 px-4 py-32 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                404 — Page Not Found
            </h1>
            <p className="text-slate-700 dark:text-slate-300">
                This page does not exist. It may have been moved or renamed.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="underline hover:no-underline">
                    Go to the homepage
                </Link>
                <Link href="/articles" className="underline hover:no-underline">
                    Browse the Encyclopaedia
                </Link>
                <Link href="/courses" className="underline hover:no-underline">
                    See the courses
                </Link>
            </div>
        </div>
    );
}
