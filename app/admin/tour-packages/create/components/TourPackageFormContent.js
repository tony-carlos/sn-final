// /app/admin/tour-packages/create/components/TourPackageFormContent.js

"use client";

import React, { useEffect, useContext } from "react";
import { FormContext } from "./FormContext";
import Step1BasicInfo from "./steps/Step1BasicInfo";
import Step2Itinerary from "./steps/Step2Itinerary";
import Step3Images from "./steps/Step3Images";
import Step4SEOIncludes from "./steps/Step4SEOIncludes";
import Step5Pricing from "./steps/Step5Pricing";
import Stepper from "./Stepper"; // Your existing Stepper component

/**
 * TourPackageFormContent Component
 *
 * Consumes the FormContext and renders the appropriate form step.
 *
 * @param {object} props - Component props.
 * @param {object} props.existingData - Existing tour package data for editing.
 * @param {boolean} props.isEdit - Indicates if the form is in edit mode.
 * @param {function} props.onSubmit - Submission handler function.
 */
const TourPackageFormContent = ({ existingData, isEdit, onSubmit }) => {
  const { currentStep, setFormId } = useContext(FormContext);

  // Set the form ID when editing
  useEffect(() => {
    if (isEdit && existingData?.id) {
      setFormId(existingData.id);
    }
  }, [isEdit, existingData?.id, setFormId]);

  return (
    <div className=" mx-auto p-6 bg-white shadow-md rounded">
      {/* Stepper */}
      <Stepper steps={["Basic Info", "Itinerary", "Images", "SEO & Includes", "Pricing"]} currentStep={currentStep} />

      {/* Render current step based on currentStep state from context */}
      {currentStep === 1 && <Step1BasicInfo isEdit={isEdit} />}
      {currentStep === 2 && <Step2Itinerary isEdit={isEdit} />}
      {currentStep === 3 && <Step3Images isEdit={isEdit} />}
      {currentStep === 4 && <Step4SEOIncludes isEdit={isEdit} />}
      {currentStep === 5 && (
        <Step5Pricing
          isEdit={isEdit}
          onFormSubmit={onSubmit} // Pass the onSubmit function as onFormSubmit
        />
      )}
    </div>
  );
};

export default TourPackageFormContent;
