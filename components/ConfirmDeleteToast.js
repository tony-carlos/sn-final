// components/ConfirmDeleteToast.js

"use client";

import React from 'react';
import { toast } from 'react-toastify';

const ConfirmDeleteToast = ({ onConfirm }) => {
  return (
    <div>
      <p>Are you sure you want to delete this destination?</p>
      <div className="flex justify-end space-x-4 mt-2">
        <button
          onClick={() => toast.dismiss()}
          className="px-3 py-1 bg-gray-300 text-gray-700 rounded"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onConfirm();
            toast.dismiss();
          }}
          className="px-3 py-1 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteToast;