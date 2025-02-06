// app/admin/quote/components/QuoteMakerForm.js

"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import ClientInfoSection from "./sections/ClientInfoSection";
import TourInfoSection from "./sections/TourInfoSection";
import PricingSection from "./sections/PricingSection";
import PaymentTermsSection from "./sections/PaymentTermsSection";
import TermsConditionsSection from "./sections/TermsConditionsSection";
import StatusSection from "./sections/StatusSection";
import ItinerarySection from "./sections/ItinerarySection";
import { toast } from "react-toastify";
import { db } from "@/app/lib/firebase";
import { addDoc, setDoc, doc, collection } from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
import { useRouter } from "next/navigation"; // Import useRouter

const QuoteMakerForm = ({ isEdit, quoteId, existingData }) => {
  const router = useRouter(); // Initialize the router
  const methods = useForm({
    defaultValues: {
      clientInfo: {
        clientName: "",
        email: "",
        phoneNumber: "",
        startingDay: "",
        endingDay: "",
      },
      totalDays: 0, // Add totalDays to default values
      tourInfo: {
        tourTitle: "",
        typeOfTour: "", // Ensure this is included
        description: "",
        startingFrom: "",
        endingFrom: "",
      },
      itinerary: existingData?.itinerary || [],
      pricing: {
        numberOfAdults: 1,
        adultPrice: 0,
        numberOfChildren: 0,
        childPrice: 0,
        include: "",
        exclude: "",
        total: 0,
      },
      paymentTerms: {
        title: "",
        description: "",
      },
      termsConditions: {
        link: "",
      },
      status: "not confirmed",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  // Reset the form with existing data when editing
  useEffect(() => {
    if (isEdit && existingData) {
      reset({
        ...existingData,
        itinerary: existingData.itinerary || [],
      });
    }
  }, [isEdit, existingData, reset]);

  const onSubmit = async (data) => {
    try {
      const sanitizeData = (obj) => {
        if (Array.isArray(obj)) {
          return obj.map(sanitizeData);
        } else if (obj && typeof obj === "object") {
          return Object.entries(obj).reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = sanitizeData(value);
            }
            return acc;
          }, {});
        }
        return obj;
      };

      const sanitizedData = sanitizeData(data);

      console.log("Sanitized Data:", sanitizedData);

      if (isEdit && quoteId) {
        await setDoc(doc(db, "quotes", quoteId), sanitizedData, {
          merge: true,
        });
        toast.success("Quote updated successfully!", {
          onClose: () => router.push("/admin/quote"),
          autoClose: 1500, // Adjust as needed
        });
      } else {
        await addDoc(collection(db, "quotes"), sanitizedData);
        toast.success("Quote submitted successfully!", {
          onClose: () => router.push("/admin/quote"),
          autoClose: 1500, // Adjust as needed
        });
        reset(); // Reset the form after successful submission
      }
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error("Failed to submit quote.");
    }
  };

  const onError = (errors) => {
    // Flatten the errors object and display error messages using toast notifications
    const flattenErrors = (errorObj, parentField = "") => {
      Object.entries(errorObj).forEach(([key, value]) => {
        if (value?.types) {
          // For multiple validation errors
          Object.values(value.types).forEach((message) => {
            toast.error(message);
          });
        } else if (value?.message) {
          // For single validation error
          toast.error(value.message);
        } else if (typeof value === "object") {
          // Recursive call for nested errors
          flattenErrors(value, `${parentField}${key}.`);
        }
      });
    };

    flattenErrors(errors);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <ClientInfoSection />
        <TourInfoSection />
        <ItinerarySection />
        <PaymentTermsSection />
        <TermsConditionsSection />
        <PricingSection />
        <StatusSection />
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className={`px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                {isEdit ? "Updating..." : "Submitting..."}
              </>
            ) : isEdit ? (
              "Update Quote"
            ) : (
              "Submit Quote"
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default QuoteMakerForm;
