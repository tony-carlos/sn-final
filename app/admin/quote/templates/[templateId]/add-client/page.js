// app/admin/quote/templates/[templateId]/add-client/page.js

"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css"; // Import toastify CSS

const AddClientToQuotePage = () => {
  const { templateId } = useParams();
  const router = useRouter();
  const [templateData, setTemplateData] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  // Watch startingDay and endingDay fields
  const startingDay = watch("startingDay");
  const endingDay = watch("endingDay");

  useEffect(() => {
    const fetchTemplateData = async () => {
      try {
        const templateDoc = await getDoc(doc(db, "quoteTemplates", templateId));
        if (templateDoc.exists()) {
          setTemplateData(templateDoc.data());
        } else {
          toast.error("Quote template not found.");
          router.push("/admin/quote/templates");
        }
      } catch (error) {
        console.error("Error fetching quote template data:", error);
        toast.error("Failed to load quote template data.");
        router.push("/admin/quote/templates");
      }
    };

    if (templateId) {
      fetchTemplateData();
    }
  }, [templateId, router]);

  useEffect(() => {
    // Calculate totalDays whenever startingDay or endingDay changes
    if (startingDay && endingDay) {
      const startDate = new Date(startingDay);
      const endDate = new Date(endingDay);
      const diffTime = endDate - startDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const totalDays = diffDays > 0 ? diffDays : 0;
      setValue("totalDays", totalDays);
    } else {
      setValue("totalDays", 0);
    }
  }, [startingDay, endingDay, setValue]);

  const onSubmit = async (clientData) => {
    try {
      // Clone the template data and add client information
      const newQuoteData = {
        ...templateData,
        clientInfo: clientData,
        createdAt: new Date(),
        templateId: templateId,
        status: "not confirmed",
      };

      // Save to quotes collection
      await addDoc(collection(db, "quotes"), newQuoteData);
      toast.success("Quote created for client successfully.");
      router.push(`/admin/quote`);
    } catch (error) {
      console.error("Error creating quote for client:", error);
      toast.error("Failed to create quote for client.");
    }
  };

  const onError = (errors) => {
    // Display validation errors using toast notifications
    const flattenErrors = (errorObj) => {
      Object.values(errorObj).forEach((error) => {
        if (error?.types) {
          Object.values(error.types).forEach((message) => {
            toast.error(message);
          });
        } else if (error?.message) {
          toast.error(error.message);
        } else if (typeof error === "object") {
          flattenErrors(error);
        }
      });
    };

    flattenErrors(errors);
  };

  if (!templateData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Client to Quote</h1>
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="bg-white p-6 rounded shadow"
        noValidate
      >
        {/* Client Information Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Client Name */}
          <div>
            <label className="block mb-2 font-medium">
              Client Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("clientName", { required: "Client Name is required" })}
              className="w-full p-3 border rounded"
              placeholder="Enter client name"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              {...register("email", {
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full p-3 border rounded"
              placeholder="Enter email"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-2 font-medium">Phone Number</label>
            <input
              type="tel"
              {...register("phoneNumber")}
              className="w-full p-3 border rounded"
              placeholder="Enter phone number"
            />
          </div>
        </div>

        {/* Date Information Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Starting Day */}
          <div>
            <label className="block mb-2 font-medium">
              Starting Day<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("startingDay", { required: "Starting Day is required" })}
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Ending Day */}
          <div>
            <label className="block mb-2 font-medium">
              Ending Day<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("endingDay", { required: "Ending Day is required" })}
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Total Days (Read-Only) */}
          <div>
            <label className="block mb-2 font-medium">Total Days</label>
            <input
              type="number"
              {...register("totalDays")}
              className="w-full p-3 border rounded bg-gray-100"
              readOnly
            />
          </div>
        </div>

        {/* Submit Button Aligned to Right */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Add Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClientToQuotePage;
