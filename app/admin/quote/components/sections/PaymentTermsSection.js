// /app/admin/quote/components/sections/PaymentTermsSection.js

"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

const PaymentTermsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Payment Terms</h2>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Payment Terms Title<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          {...register("paymentTerms.title", {
            required: "Payment Terms Title is required",
            minLength: {
              value: 5,
              message: "Title must be at least 5 characters",
            },
          })}
          className="w-full p-2 border rounded"
          placeholder="Enter Payment Terms Title"
        />
        {errors.paymentTerms?.title && (
          <p className="text-red-500 text-sm mt-1">
            {errors.paymentTerms.title.message}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Payment Terms Description<span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("paymentTerms.description", {
            required: "Payment Terms Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
          className="w-full p-2 border rounded"
          rows="4"
          placeholder="Enter Payment Terms Description"
        ></textarea>
        {errors.paymentTerms?.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.paymentTerms.description.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentTermsSection;
