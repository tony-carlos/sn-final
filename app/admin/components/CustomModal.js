// app/admin/accommodations/components/CustomModal.js

"use client";

import React from "react";

const CustomModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CustomModal;
