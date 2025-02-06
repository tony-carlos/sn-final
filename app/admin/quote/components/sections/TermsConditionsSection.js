// /app/admin/quote/components/sections/TermsConditionsSection.js

"use client";

import React from "react";
import { useFormContext } from "react-hook-form";

const TermsConditionsSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Terms & Conditions (Optional)</h2>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Link to Terms & Conditions
        </label>
        <input
          type="url"
          {...register("termsConditions.link", {
            pattern: {
              value:
                /^(https?:\/\/)?([\w\d\-]+\.){1,}[\w\d\-]+(\/[\w\d\-._~:/?#@!$&'()*+,;=]*)?$/,
              message: "Enter a valid URL",
            },
          })}
          className="w-full p-2 border rounded"
          placeholder="https://example.com/terms"
        />
        {errors.termsConditions?.link && (
          <p className="text-red-500 text-sm mt-1">
            {errors.termsConditions.link.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default TermsConditionsSection;
