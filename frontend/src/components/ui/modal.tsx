import React, { useState, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

interface ModalHeaderProps {
  children: ReactNode;
}

interface ModalBodyProps {
  children: ReactNode;
}

interface ModalFooterProps {
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose} />
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ children }) => (
  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    <h3 className="text-lg leading-6 font-medium text-gray-900">{children}</h3>
  </div>
);

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => (
  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    {children}
  </div>
);

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => (
  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
    {children}
  </div>
);

export { Modal, ModalHeader, ModalBody, ModalFooter };