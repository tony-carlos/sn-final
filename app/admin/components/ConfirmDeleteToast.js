// app/admin/components/ConfirmDeleteToast.js

"use client";

import React from "react";
import { toast } from "react-toastify";

const ConfirmDeleteToast = ({ onConfirm }) => {
  return (
    <div className="flex flex-col items-center">
      <p className="mb-4">Are you sure you want to delete this destination?</p>
      <div className="flex space-x-4">
        <button
          onClick={() => {
            onConfirm();
            toast.dismiss(); // Close the toast after confirmation
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Yes
        </button>
        <button
          onClick={() => {
            toast.dismiss(); // Close the toast without confirming
          }}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmDeleteToast;
