"use client";

import React, { createContext, useState } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

// Create the context
export const FormContext = createContext();

/**
 * FormContextProvider Component
 *
 * Provides form state and functions to manage multi-step form navigation and data manipulation.
 *
 * @param {object} props - Component props.
 * @param {object} props.children - Child components.
 */
export const FormContextProvider = ({ children }) => {
  const { setValue, getValues, reset } = useFormContext();
  const [currentStep, setCurrentStep] = useState(1);

  // Initialize formData based on react-hook-form's data
  const [formData, setFormData] = useState(getValues());

  /**
   * Updates a specific part of the form data.
   *
   * If data is an array, it replaces the field.
   * If data is an object, it merges it with the existing field data.
   *
   * @param {string} section - The section of the form to update (e.g., 'basicInfo').
   * @param {object|array|string|number|boolean} data - The data to update within the section.
   */
  const updateFormData = (section, data) => {
    if (Array.isArray(data)) {
      // If data is an array (e.g., includes or excludes), replace the entire field
      setFormData((prev) => ({
        ...prev,
        [section]: data,
      }));
      setValue(section, data, { shouldValidate: true, shouldDirty: true });
    } else {
      // If data is an object, merge it with the existing section
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...data },
      }));
      setValue(section, { ...getValues(section), ...data }, { shouldValidate: true, shouldDirty: true });
    }
  };

  /**
   * Updates manual pricing for a specific season.
   *
   * @param {string} seasonKey - The key of the season (e.g., 'highSeason').
   * @param {object} data - The pricing data to update (e.g., { costs: [...], discount: 10 }).
   */
  const updateManualPricing = (seasonKey, data) => {
    const currentManual = formData?.pricing?.manual || {};
    const currentSeasonData = currentManual[seasonKey] || { costs: [], discount: 0 };
    const updatedManual = {
      ...currentManual,
      [seasonKey]: {
        ...currentSeasonData,
        ...data,
      },
    };
    setFormData((prev) => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        manual: updatedManual,
      },
    }));
    setValue("pricing.manual", updatedManual, { shouldValidate: true, shouldDirty: true });
  };

  /**
   * Clears all manual pricing data.
   */
  const clearPricingData = () => {
    setFormData((prev) => ({
      ...prev,
      pricing: {
        manual: {},
      },
    }));
    setValue("pricing.manual", {}, { shouldValidate: true, shouldDirty: true });
    toast.info("Pricing data has been cleared.");
  };

  /**
   * Moves to the next step.
   */
  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  /**
   * Moves to the previous step.
   */
  const prevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  /**
   * Resets the entire form to its initial state.
   */
  const resetForm = () => {
    reset();
    setFormData(getValues());
    setCurrentStep(1);
    toast.info("Form has been reset.");
  };

  /**
   * Sets the Firestore document ID for the form (used during editing).
   *
   * @param {string} id - The Firestore document ID.
   */
  const setFormId = (id) => {
    setFormData((prev) => ({
      ...prev,
      id,
    }));
  };

  return (
    <FormContext.Provider
      value={{
        currentStep,
        nextStep,
        prevStep,
        resetForm,
        formData,
        updateFormData,       // General data update
        updateManualPricing,  // Specific for manual pricing
        clearPricingData,     // To clear pricing data
        setFormId,            // Function to set the Firestore document ID
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export default FormContextProvider;
