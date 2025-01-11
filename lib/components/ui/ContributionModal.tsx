'use client'
import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Modal, useTheme } from '@mui/material';
import { GitHub } from '@mui/icons-material';

interface ContributeModalProps {
  docsRepositoryBase: string;
  filePath?: string;
}

const ContributionModal = ({
  docsRepositoryBase,
  filePath,
}: ContributeModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickOpen = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const EDIT_LINK_DESCRIPTION = "Edit this page on GitHub →";

  return (
    <>
      <a onClick={handleClickOpen}>{EDIT_LINK_DESCRIPTION}</a>
      <Dialog
        open={isOpen}
        onClose={(evt, reason) => {return handleClose()}}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
        >
          <DialogTitle
              className="nx-text-xs nx-font-medium nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100 contrast-more:nx-text-gray-800 contrast-more:dark:nx-text-gray-50"
          >
              Edit this page on GitHub ✏️
          </DialogTitle>
          <DialogContent>
            <p>Work in progress</p>
          </DialogContent>
          <DialogActions>
            <a
                href={docsRepositoryBase}
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

export default ContributionModal;