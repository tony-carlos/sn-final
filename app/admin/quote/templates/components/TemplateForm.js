// /app/admin/quote/templates/components/TemplateForm.js

"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { toast } from "react-toastify";
import { db } from "@/app/lib/firebase";
import { addDoc, setDoc, doc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import Select from "react-select"; // Import react-select
import ItinerarySection from "../../components/sections/ItinerarySection"; // Adjust the path as needed
import { CKEditor } from "@ckeditor/ckeditor5-react";

// Define tour types options
const tourTypesOptions = [
  { value: "", label: "Select Type of Tour", isDisabled: true },
  { value: "private", label: "Private" },
  { value: "group", label: "Group" },
  { value: "couple", label: "Couple" },
  { value: "family", label: "Family" },
];

const TemplateForm = ({ isEdit = false, templateId = null, existingData = null }) => {
  const router = useRouter();

  // Initialize the form with default values or existing data
  const methods = useForm({
    defaultValues: {
      tourInfo: {
        tourTitle: "",
        typeOfTour: "",
        description: "",
        startingFrom: "",
        endingFrom: "",
        logoUrl: "",
        // Add other necessary fields
      },
      // Add other sections as needed
      status: "not confirmed",
      itinerary: [], // Initialize as empty array; ItinerarySection manages it
      // ... other fields
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    register,
    control,
    setValue,
    watch,
    unregister,
    formState: { errors },
  } = methods;

  // Populate form with existing data when editing
  useEffect(() => {
    if (isEdit && existingData) {
      reset({
        ...existingData,
        tourInfo: {
          ...existingData.tourInfo,
          logoUrl: existingData.tourInfo?.logoUrl || "",
          // Populate other tourInfo fields as needed
        },
        // Populate other sections as needed
      });
    }
  }, [isEdit, existingData, reset]);

  const onSubmit = async (data) => {
    try {
      const sanitizedData = sanitizeData(data);

      if (isEdit && templateId) {
        // Update existing template
        await setDoc(doc(db, "quoteTemplates", templateId), sanitizedData, { merge: true });
        toast.success("Template updated successfully!", {
          onClose: () => router.push("/admin/quote/templates"),
          autoClose: 1500, // Adjust delay as needed
        });
      } else {
        // Create new template
        await addDoc(collection(db, "quoteTemplates"), sanitizedData);
        toast.success("Template created successfully!", {
          onClose: () => router.push("/admin/quote/templates"),
          autoClose: 1500, // Adjust delay as needed
        });
        reset(); // Reset the form after successful creation
      }
    } catch (error) {
      console.error("Error submitting template:", error);
      toast.error("Failed to submit template.");
    }
  };

  const sanitizeData = (obj) => {
    // Implement any necessary data sanitization here
    // For now, we'll return the object as is
    return obj;
  };

  const onError = (errors) => {
    // Display validation errors using toast notifications
    Object.values(errors).forEach((error) => {
      if (error.message) {
        toast.error(error.message);
      }
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        {/* Tour Info Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Tour Information</h2>

          {/* Tour Title */}
          <div className="mb-4">
            <label className="block text-gray-700">Tour Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register("tourInfo.tourTitle", { required: "Tour Title is required." })}
              className={`w-full px-4 py-2 border rounded mt-1 ${
                errors.tourInfo?.tourTitle ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Tour Title"
            />
            {errors.tourInfo?.tourTitle && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tourInfo.tourTitle.message}
              </p>
            )}
          </div>

          {/* Type of Tour */}
          <div className="mb-4">
            <label className="block text-gray-700">Type of Tour <span className="text-red-500">*</span></label>
            <Controller
              name="tourInfo.typeOfTour"
              control={control}
              rules={{ required: "Type of Tour is required." }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={tourTypesOptions}
                  placeholder="Select Type of Tour"
                  classNamePrefix="react-select"
                  isClearable={false}
                />
              )}
            />
            {errors.tourInfo?.typeOfTour && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tourInfo.typeOfTour.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700">Description <span className="text-red-500">*</span></label>
            <Controller
              name="tourInfo.description"
              control={control}
              rules={{
                required: "Description is required.",
              }}
              render={({ field }) => (
                <CKEditor
                  data={field.value || ""}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    field.onChange(data);
                  }}
                />
              )}
            />
            {errors.tourInfo?.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tourInfo.description.message}
              </p>
            )}
          </div>

          {/* Starting From */}
          <div className="mb-4">
            <label className="block text-gray-700">Starting From <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register("tourInfo.startingFrom", { required: "Starting From is required." })}
              className={`w-full px-4 py-2 border rounded mt-1 ${
                errors.tourInfo?.startingFrom ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Starting Location"
            />
            {errors.tourInfo?.startingFrom && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tourInfo.startingFrom.message}
              </p>
            )}
          </div>

          {/* Ending From */}
          <div className="mb-4">
            <label className="block text-gray-700">Ending From <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register("tourInfo.endingFrom", { required: "Ending From is required." })}
              className={`w-full px-4 py-2 border rounded mt-1 ${
                errors.tourInfo?.endingFrom ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Ending Location"
            />
            {errors.tourInfo?.endingFrom && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tourInfo.endingFrom.message}
              </p>
            )}
          </div>

          {/* Logo URL */}
          <div className="mb-4">
            <label className="block text-gray-700">Logo URL <span className="text-red-500">*</span></label>
            <input
              type="text"
              {...register("tourInfo.logoUrl", {
                required: "Logo URL is required.",
                pattern: {
                  value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i,
                  message: "Enter a valid image URL.",
                },
              })}
              className={`w-full px-4 py-2 border rounded mt-1 ${
                errors.tourInfo?.logoUrl ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Logo Image URL"
            />
            {errors.tourInfo?.logoUrl && (
              <p className="text-red-500 text-sm mt-1">
                {errors.tourInfo.logoUrl.message}
              </p>
            )}
          </div>
        </div>

        {/* Itinerary Section */}
        <ItinerarySection isEdit={isEdit} existingData={existingData} />

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className={`px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center ${
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
            ) : (
              isEdit ? "Update Template" : "Create Template"
            )}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default TemplateForm;
