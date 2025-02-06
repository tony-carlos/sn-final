// /app/admin/tour-packages/create/components/Stepper.js

'use client';

import React from 'react';

/**
 * Stepper Component
 *
 * Displays the steps of the multi-step form and highlights the current step.
 *
 * @param {object} props - Component props.
 * @param {string[]} props.steps - Array of step names.
 * @param {number} props.currentStep - The current active step.
 */
const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={index} className="flex-1 flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isCompleted
                  ? 'bg-green-500 border-green-500'
                  : isActive
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-gray-300'
              }`}
            >
              {isCompleted ? (
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                <span
                  className={`text-sm font-medium ${
                    isActive ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {stepNumber}
                </span>
              )}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                }`}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
