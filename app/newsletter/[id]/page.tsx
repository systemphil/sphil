import { NEWSLETTERS } from "lib/email/data/newsletters";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { id } = await params;
    const selectedEmail = NEWSLETTERS.find((email) => email.id === id);

    if (!selectedEmail) {
        return {
            title: "Newsletter Not Found",
        };
    }

    return {
        title: `${selectedEmail.title} | sPhil Newsletter`,
        description: selectedEmail.subtitle,
        openGraph: {
            title: selectedEmail.title,
            description: `${selectedEmail.subtitle} - Guided studies of the world's foundational philosophical and literary texts designed for close reading and lasting understanding. Sign up for the newsletter.`,
            type: "article",
            publishedTime: selectedEmail.subtitle,
        },
    };
}

export async function generateStaticParams() {
    return NEWSLETTERS.map((newsletter) => ({
        id: newsletter.id,
    }));
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function NewsletterPage({ params }: PageProps) {
    const { id } = await params;

    const currentIndex = NEWSLETTERS.findIndex((n) => n.id === id);
    const selectedEmail = NEWSLETTERS[currentIndex];

    if (!selectedEmail) {
        return notFound();
    }

    const newerEmail = NEWSLETTERS[currentIndex - 1];
    const olderEmail = NEWSLETTERS[currentIndex + 1];

    const SelectedComponent = selectedEmail.component;

    return (
        <div className="flex flex-col min-h-full">
            {/* Content */}
            <div className="flex-grow">
                <SelectedComponent />
            </div>

            {/* Navigation Footer */}
            <div className="mt-12 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="flex justify-start">
                    {newerEmail ? (
                        <Link
                            href={`/newsletter/${newerEmail.id}`}
                            className="group flex flex-col items-start text-left no-underline"
                        >
                            <span className="text-xs text-gray-400 mb-1 group-hover:text-gray-600 transition-colors">
                                ← Newer
                            </span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {newerEmail.title}
                            </span>
                        </Link>
                    ) : (
                        <span className="text-xs text-gray-300 select-none">
                            This is the latest newsletter
                        </span>
                    )}
                </div>

                <div className="flex justify-end">
                    {olderEmail ? (
                        <Link
                            href={`/newsletter/${olderEmail.id}`}
                            className="group flex flex-col items-end text-right no-underline"
                        >
                            <span className="text-xs text-gray-400 mb-1 group-hover:text-gray-600 transition-colors">
                                Older →
                            </span>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {olderEmail.title}
                            </span>
                        </Link>
                    ) : (
                        <span className="text-xs text-gray-300 select-none">
                            End of archive
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
