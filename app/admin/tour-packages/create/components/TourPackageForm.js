'use client';

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import FormContextProvider from "./FormContext"; // Import FormContextProvider
import TourPackageFormContent from "./TourPackageFormContent"; // Import the content component
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from 'next/navigation'; // Correct import for App Router
import generateSlug from "../utils/generateSlug";

/**
 * TourPackageForm Component
 *
 * A reusable form component for creating and editing tour packages.
 * It manages the multi-step form process and integrates with the FormContext.
 *
 * @param {object} props - Component props.
 * @param {object} props.existingData - Existing tour package data for editing.
 * @param {boolean} props.isEdit - Indicates if the form is in edit mode.
 */
const TourPackageForm = ({ existingData = null, isEdit = false }) => {
  const router = useRouter();

  /**
   * getDefaultValues Function
   *
   * Merges existing data with default values to ensure all necessary fields are initialized.
   *
   * @param {object} existingData - Existing tour package data.
   * @returns {object} - Default values for the form.
   */
  function getDefaultValues(existingData) {
    return {
      basicInfo: {
        tourTitle: "",
        slug: "",
        description: "",
        tags: [],
        mainFocus: [],
        groupType: "",
        country: null, // Country field
        from: null, // Starting destination
        ends: null, // Ending destination
        durationValue: "",
        durationUnit: "",
        isFeatured: false,
        isOffer: false,
        isRecommended: false,
        isSpecialPackage: false,
        isDayTrip: false,
        isNew: false,
        availability: [],
        fullYearAvailability: false,
        ...existingData?.basicInfo,
      },
      
      itinerary:
        existingData?.itinerary || [
          {
            title: "",
            description: "",
            destination: null,
            accommodation: null,
            meals: [],
            time: "",
            distance: "",
            maxAltitude: "",
            destinationImages: [], // To store fetched destination images
            accommodationImages: [], // To store fetched accommodation images
          },
        ], // Itinerary field
      images: existingData?.images || [],
      seo: {
        seoTitle_en: "",
        seoDescription_en: "",
        seoKeywords_en: [],
        seoTitle_DE: "",
        seoDescription_DE: [],
        seoKeywords_DE: [],
        ...existingData?.seo,
      },
      pricing: {
        manual: {
          highSeason: {
            costs: [],
            discount: 0,
            ...existingData?.pricing?.manual?.highSeason,
          },
          midSeason: {
            costs: [],
            discount: 0,
            ...existingData?.pricing?.manual?.midSeason,
          },
          lowSeason: {
            costs: [],
            discount: 0,
            ...existingData?.pricing?.manual?.lowSeason,
          },
        },
      },
      includes: existingData?.includes || [], // Top-level includes
      excludes: existingData?.excludes || [], // Top-level excludes
      id: existingData?.id || null, // To track if it's in edit mode
      createdAt: existingData?.createdAt || null, // To preserve creation timestamp
      status: existingData?.status || "draft", // Package status
    };
  }

  // Initialize react-hook-form methods with updated defaultValues
  const methods = useForm({
    mode: "onChange", // Enables real-time validation
    defaultValues: getDefaultValues(existingData),
  });

  const { handleSubmit, setValue, formState } = methods;

  /**
   * Handles form submission for both creation and editing.
   * @param {Object} data - The form data.
   */
  const onSubmit = async (data) => {
    try {
      let slug;
      let originalSlug = existingData?.basicInfo?.slug || "";

      if (isEdit) {
        // **Edit Mode:** Use the original slug from existingData
        originalSlug = existingData.basicInfo.slug;
        slug = data.basicInfo.slug || originalSlug; // Use updated slug if provided
      } else {
        // **Create Mode:** Generate a unique slug based on the tour title
        slug = generateSlug(data.basicInfo.tourTitle);
        setValue("basicInfo.slug", slug);
        console.log("Form Submit - Generated Slug:", slug); // Debugging
      }

      const tourData = {
        ...data, // Includes data from all steps
        basicInfo: {
          ...data.basicInfo,
          slug,
        },
        // 'status' is a top-level field and already included in data
      };

      console.log("Form Submit - Tour Data:", tourData); // Debugging

      if (isEdit && slug) {
        // **Edit Mode: Update Existing Package via API using Original Slug**
        const response = await axios.put(`/api/tour-packages/${originalSlug}`, tourData);
        if (response.status === 200) {
          toast.success("Tour package updated successfully.");
          // Redirect back to the admin tour packages list
          router.push(`/admin/tour-packages`);
        } else {
          toast.error("Failed to update tour package.");
        }
      } else {
        // **Create Mode: Add New Package via API**
        const response = await axios.post("/api/tour-packages", tourData);
        if (response.status === 201) {
          toast.success("Tour package created successfully.");
          router.push("/admin/tour-packages");
        } else {
          toast.error("Failed to create tour package.");
        }
      }
    } catch (error) {
      // Enhanced error logging for better debugging
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Error submitting form:", error.response.data);
        toast.error(`Failed to submit form: ${error.response.data.error || 'Unknown error.'}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        toast.error("Failed to submit form: No response from server.");
      } else {
        // Something else happened
        console.error("Error submitting form:", error.message);
        toast.error(`Failed to submit form: ${error.message}`);
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <FormContextProvider>
        <TourPackageFormContent
          existingData={existingData}
          isEdit={isEdit}
          onSubmit={handleSubmit(onSubmit)} // Pass the onSubmit function as onFormSubmit
        />
      </FormContextProvider>
    </FormProvider>
  );
};

export default TourPackageForm;
