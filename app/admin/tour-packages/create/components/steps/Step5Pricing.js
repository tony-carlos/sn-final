"use client";

import React, { useMemo, useContext } from "react";
import { useFormContext } from "react-hook-form";
import { FormContext } from "../FormContext"; // Adjust the import path if necessary
import { FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

/**
 * Defines the three seasons for pricing.
 */
const seasons = [
  { key: "highSeason", label: "High Season (July, August, Dec 20th - Jan 10th)" },
  { key: "midSeason", label: "Mid Season (Rest of the year)" },
  { key: "lowSeason", label: "Low Season (April 1st - May 19th)" },
];

/**
 * Step5Pricing Component
 *
 * Handles the Manual Pricing step in the tour package form.
 * Supports both creation and editing of tour packages.
 * Disables the Submit button until pricing data for all three seasons is entered.
 * Provides toast notifications for success and error feedback.
 * Displays the total cost for each season after applying the discount.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isEdit - Indicates if the form is in edit mode.
 * @param {function} props.onFormSubmit - Submission handler function.
 */
const Step5Pricing = ({ isEdit, onFormSubmit }) => { // Corrected prop destructuring
  const {
    setValue,
    formState: { errors, isSubmitting },
  } = useFormContext();

  const { formData, updateManualPricing, prevStep } = useContext(FormContext);
  const [status, setStatus] = React.useState(formData?.status || "draft"); // Package status: 'draft' or 'published'

  /**
   * Determines if pricing is complete for all seasons.
   * A season is considered complete if it has at least one pricing entry.
   */
  const isPricingComplete = useMemo(() => {
    if (!formData?.pricing?.manual) return false;
    return seasons.every(season => {
      const seasonData = formData.pricing.manual[season.key];
      return seasonData && Array.isArray(seasonData.costs) && seasonData.costs.length > 0;
    });
  }, [formData?.pricing?.manual]);

  /**
   * Adds a new pricing entry for a given season.
   *
   * @param {string} seasonKey - The key of the season.
   */
  const handleAddManualCost = (seasonKey) => {
    const newCost = { category: "per_person", cost: 0 };
    const updatedCosts = [
      ...(formData.pricing.manual[seasonKey]?.costs || []),
      newCost
    ];
    updateManualPricing(seasonKey, { costs: updatedCosts });
  };

  /**
   * Removes a pricing entry from a given season.
   *
   * @param {string} seasonKey - The key of the season.
   * @param {number} index - The index of the pricing entry to remove.
   */
  const handleRemoveManualCost = (seasonKey, index) => {
    const updatedCosts = [...(formData.pricing.manual[seasonKey]?.costs || [])];
    updatedCosts.splice(index, 1);
    updateManualPricing(seasonKey, { costs: updatedCosts });

    // If no costs remain, reset the discount to 0
    if (updatedCosts.length === 0) {
      updateManualPricing(seasonKey, { discount: 0 });
      toast.info(`All pricing entries removed for ${seasons.find(s => s.key === seasonKey).label}. Discount has been reset.`);
    }
  };

  /**
   * Updates a specific field of a pricing entry.
   *
   * @param {string} seasonKey - The key of the season.
   * @param {number} index - The index of the pricing entry.
   * @param {string} field - The field to update ('category' or 'cost').
   * @param {string|number} value - The new value.
   */
  const handleManualCostChange = (seasonKey, index, field, value) => {
    const updatedCosts = [...(formData.pricing.manual[seasonKey]?.costs || [])];
    updatedCosts[index][field] = field === "cost" ? Number(value) : value;
    updateManualPricing(seasonKey, { costs: updatedCosts });
  };

  /**
   * Updates the discount for a given season.
   *
   * @param {string} seasonKey - The key of the season.
   * @param {string|number} value - The new discount value.
   */
  const handleManualDiscountChange = (seasonKey, value) => {
    // If there are no pricing entries, do not allow setting a discount
    if (formData.pricing.manual[seasonKey]?.costs.length === 0) {
      toast.warn(`Please add at least one pricing entry before setting a discount for ${seasons.find(s => s.key === seasonKey).label}.`);
      return;
    }

    const discountValue = Number(value);
    if (isNaN(discountValue) || discountValue < 0 || discountValue > 100) {
      toast.error('Discount must be a number between 0 and 100.');
      return;
    }

    updateManualPricing(seasonKey, { discount: discountValue });
  };

  /**
   * Calculates the total cost for a season before discount.
   *
   * @param {string} seasonKey - The key of the season.
   * @returns {number} - Total cost before discount.
   */
  const calculateTotalBeforeDiscount = (seasonKey) => {
    const costs = formData.pricing.manual[seasonKey]?.costs || [];
    return costs.reduce((acc, item) => acc + item.cost, 0);
  };

  /**
   * Calculates the total cost for a season after applying discount.
   *
   * @param {string} seasonKey - The key of the season.
   * @returns {number} - Total cost after discount.
   */
  const calculateTotalAfterDiscount = (seasonKey) => { // Corrected to use seasonKey
    const totalBefore = calculateTotalBeforeDiscount(seasonKey);
    const discount = formData.pricing.manual[seasonKey]?.discount || 0;
    return totalBefore * (1 - discount / 100);
  };

  /**
   * Handles the status change.
   *
   * @param {object} e - The event object.
   */
  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setValue('status', newStatus);
  };

  // Guard clause to prevent errors if formData.pricing.manual is undefined
  if (!formData || !formData.pricing || !formData.pricing.manual) {
    return <div>Loading pricing data...</div>;
  }

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6">Step 5: Pricing</h2>

      {/* Package Status */}
      <div className="mb-6">
        <label className="block text-lg font-medium mb-2">
          Package Status<span className="text-red-500">*</span>
        </label>
        <select
          value={status}
          onChange={handleStatusChange}
          className="p-3 border rounded w-full focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        >
          <option value="">Select Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-red-500 text-sm">{errors.status.message}</p>
        )}
      </div>

      {/* Manual Pricing Sections */}
      <div className="space-y-8">
        {seasons.map((season) => {
          const totalBefore = calculateTotalBeforeDiscount(season.key);
          const totalAfter = calculateTotalAfterDiscount(season.key);
          const hasCosts = formData.pricing.manual[season.key]?.costs.length > 0;

          return (
            <div
              key={season.key}
              className="p-6 border rounded-lg bg-gray-50 w-full"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-semibold">{season.label}</h3>
                <div className="flex items-center space-x-2">
                  <label className="font-semibold">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.pricing.manual[season.key]?.discount || 0}
                    onChange={(e) =>
                      handleManualDiscountChange(season.key, e.target.value)
                    }
                    className={`p-2 border rounded w-20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs ${
                      !hasCosts ? 'bg-gray-200 cursor-not-allowed' : ''
                    }`}
                    min="0"
                    max="100"
                    disabled={!hasCosts}
                    required={hasCosts}
                  />
                </div>
              </div>
              {formData.pricing.manual[season.key]?.costs.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 mb-3 p-4 bg-white rounded-lg border w-full text-xs"
                >
                  <select
                    value={item.category}
                    onChange={(e) =>
                      handleManualCostChange(
                        season.key,
                        index,
                        "category",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    required
                  >
                    <option value="per_person">Per Person</option>
                    <option value="per_group">Per Group</option>
                    <option value="per_day">Per Day</option>
                    {/* Add more categories if needed */}
                  </select>
                  <input
                    type="number"
                    placeholder="Cost"
                    value={item.cost}
                    onChange={(e) =>
                      handleManualCostChange(
                        season.key,
                        index,
                        "cost",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                    min="0"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveManualCost(season.key, index)}
                    className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddManualCost(season.key)}
                className="flex items-center text-blue-500 hover:text-blue-700 mt-2"
              >
                <FaPlus className="mr-2" /> Add Pricing
              </button>

              {/* Total Section */}
              <div className="mt-6 p-4 bg-green-100 border border-green-300 rounded-lg">
                <p className="text-sm font-medium text-green-700">
                  Total Before Discount:{" "}
                  <span className="font-semibold">${totalBefore.toFixed(2)}</span>
                </p>
                <p className="text-sm font-medium text-green-700">
                  Discount:{" "}
                  <span className="font-semibold">
                    {formData.pricing.manual[season.key]?.discount || 0}%
                  </span>
                </p>
                <p className="text-sm font-medium text-green-700">
                  Total After Discount:{" "}
                  <span className="font-semibold">
                    ${totalAfter.toFixed(2)}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className={`bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          Back
        </button>
        {/* Submit Button */}
        <button
          type="button"
          onClick={onFormSubmit} // Directly use onFormSubmit without handleSubmit
          className={`bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors ${
            !isPricingComplete || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={!isPricingComplete || isSubmitting}
        >
          {isEdit
            ? isSubmitting
              ? 'Updating...'
              : 'Update Tour Package'
            : isSubmitting
              ? 'Creating...'
              : 'Create Tour Package'}
        </button>
      </div>
    </div>
  );
};

export default Step5Pricing;
