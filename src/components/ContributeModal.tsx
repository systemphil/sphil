import { useState } from "react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { icons } from "lucide-react";

interface ContributeModalProps {
    docsRepositoryBase: string;
    filePath?: string;
}

export function ContributeModal({
    docsRepositoryBase,
    filePath,
}: ContributeModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);

    const githubEditUrl = `${docsRepositoryBase}/${filePath || ""}`;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <a
                    onClick={() => setIsOpen(true)}
                    className="nx-text-xs nx-font-medium nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100 contrast-more:nx-text-gray-800 contrast-more:dark:nx-text-gray-50"
                >
                    Edit this page on GitHub ✏️
                </a>
            </DialogTrigger>{" "}
            <DialogContent
                className={`sm:max-w-[450px] sm:min-h-[300px] justify-center dark:border-slate-900 bg-gradient-to-b from-white to-gray-50/80 dark:from-neutral-950/90 dark:to-neutral-900/90`}
            >
                <DialogHeader>
                    <DialogTitle>Contribute to this page</DialogTitle>
                    <DialogDescription>
                        Here are a few resources to help you contribute
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <h4 className="text-sm font-medium mb-2">
                        Contribution checklist:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li>
                            <a
                                href="https://docs.github.com/en/get-started/quickstart/hello-world"
                                className="hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleClose}
                            >
                                Familiarize yourself with Git basics
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://www.markdownguide.org/basic-syntax/"
                                className="hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleClose}
                            >
                                Learn Markdown syntax
                            </a>
                        </li>
                        <li>
                            <Link
                                href="/contributing"
                                className="hover:underline"
                                onClick={handleClose}
                            >
                                Read our contribution guidelines
                            </Link>
                        </li>
                    </ul>
                </div>
                <DialogFooter className="sm:justify-start">
                    <a
                        href={githubEditUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 rounded nx-font-semibold nx-text-primary-800"
                        onClick={handleClose}
                    >
                        <icons.Github className="w-4 h-4 mr-2" />
                        Continue to GitHub
                    </a>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
