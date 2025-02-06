// /app/admin/quote/components/sections/StatusSection.js

"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

const StatusSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Status</h2>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Status<span className="text-red-500">*</span>
        </label>
        <select
          {...register("status", {
            required: "Status is required",
          })}
          className="w-full p-2 border rounded"
          defaultValue="not confirmed"
        >
          <option value="not confirmed">Not Confirmed</option>
          <option value="confirmed">Confirmed</option>
          <option value="partial paid">Partial Paid</option>
          <option value="full paid">Full Paid</option>
          <option value="new">New</option>
        </select>
        {errors.status && (
          <p className="text-red-500 text-sm mt-1">
            {errors.status.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatusSection;
