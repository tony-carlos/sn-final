// /app/admin/tour-packages/create/components/steps/FormProviderWrapper.js

'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Step2ItineraryMain from './Step2Itinerary';
import Step5Pricing from './Step5Pricing';
// Import other steps as needed

const FormProviderWrapper = ({ children, packageId }) => {
  const methods = useForm({
    defaultValues: {
      // Define your default form values here
      itinerary: [],
      pricingMode: 'manual', // or 'calculator'
      // ... other form fields
    },
    mode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      {children}
    </FormProvider>
  );
};

export default FormProviderWrapper;
