// /app/admin/quote/components/FormContext.js

"use client";

import React, { createContext, useContext, useState } from "react";

const FormContext = createContext();

export const useFormStep = () => useContext(FormContext);

const FormContextProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const value = {
    currentStep,
    setCurrentStep,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export default FormContextProvider;
