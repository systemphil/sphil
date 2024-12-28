import React, { useEffect, useState } from 'react';
import { Modal, useTheme } from '@mui/material';

const RedirectModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleRedirect = () => {
    window.location.href = 'https://github.com/systemphil/sphil';
  };

  return (
    <Modal
      open={true}
      onClose={handleRedirect}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
      >
        <a
            onClick={() => setIsOpen(true)}
            className="nx-text-xs nx-font-medium nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100 contrast-more:nx-text-gray-800 contrast-more:dark:nx-text-gray-50"
        >
            Edit this page on GitHub ✏️
        </a>
        <p>Please wait, you will be redirected to github.com/systemphil/sphil</p>
      </div>
    </Modal>
  );
};

export default RedirectModal;