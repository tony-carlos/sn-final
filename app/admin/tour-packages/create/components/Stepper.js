// /app/admin/tour-packages/create/components/Stepper.js

'use client';

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Stepper Component
 *
 * Displays the progress of a multi-step form.
 *
 * @param {object} props - Component props.
 * @param {string[]} props.steps - Array of step names.
 * @param {number} props.currentStep - The current active step (1-based index).
 */
const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between mb-12">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={index} className="flex-1 flex items-center">
            {/* Step Indicator */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isActive
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {isCompleted ? '✔️' : stepNumber}
            </div>

            {/* Step Label */}
            <div className="ml-4">
              <p
                className={`font-medium ${
                  isActive ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {step}
              </p>
            </div>

            {/* Connector Line */}
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 ${
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

Stepper.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default Stepper;
