"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Modal,
    useTheme,
} from "@mui/material";
import { GitHub } from "@mui/icons-material";

interface ContributeModalProps {
    docsRepositoryBase: string;
    filePath?: string;
}

export const ContributionModal = ({
    docsRepositoryBase,
    filePath,
}: ContributeModalProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const githubEditUrl = `${docsRepositoryBase}/${filePath || ""}`;

    const handleClickOpen = (e) => {
        e.preventDefault();
        setIsOpen(true);
    };
    const handleClose = () => {
        setIsOpen(false);
    };

    const EDIT_LINK_DESCRIPTION = "Edit this page on GitHub ✏️";

    return (
        <>
            <p onClick={handleClickOpen}>{EDIT_LINK_DESCRIPTION}</p>
            <Dialog
                open={isOpen}
                onClose={(evt, reason) => {
                    return handleClose();
                }}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div className="nx-text-xs nx-font-medium nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100 contrast-more:nx-text-gray-800 contrast-more:dark:nx-text-gray-50">
                    <DialogTitle className="nx-text-xs nx-font-medium nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100 contrast-more:nx-text-gray-800 contrast-more:dark:nx-text-gray-50">
                        You are about to be taken to GitHub
                    </DialogTitle>
                    <DialogContent>
                        <h4 className="text-sm font-medium mb-2">
                            You might want to
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
                                    Familiarize yourself with the basics of
                                    GitHub
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
                                <a
                                    href="/contributing"
                                    className="hover:underline"
                                    onClick={handleClose}
                                >
                                    Read our contribution guidelines
                                </a>
                            </li>
                        </ul>
                    </DialogContent>
                    <DialogActions>
                        <a
                            href={githubEditUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 rounded nx-font-semibold nx-text-primary-800"
                            onClick={handleClose}
                        >
                            <GitHub className="w-4 h-4 mr-2" />
                            Continue to GitHub
                        </a>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
};
