// /app/admin/quote/components/sections/SortableItem.js

"use client";

import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const SortableItem = ({
  id,
  fieldId, // Unique identifier for the field
  index,
  remove,
  destinations,
  accommodations,
  isLoadingAccommodations,
  fetchAccommodations,
  unregister,
  setValue,
}) => {
  // Initialize sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Apply transformation styles for drag-and-drop
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Access form context and watch selected values
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const itineraryWatch = watch("itinerary");
  const selectedDestination = itineraryWatch?.[index]?.destination;
  const selectedAccommodation = itineraryWatch?.[index]?.accommodation;

  /**
   * Handler for destination selection change.
   * Updates the form value and fetches relevant accommodations.
   *
   * @param {Object} selected - Selected destination option.
   */
  const handleDestinationChange = async (selected) => {
    // Update the form value for destination
    setValue(`itinerary.${index}.destination`, selected);
    // Also store the destination name
    setValue(`itinerary.${index}.destinationName`, selected ? selected.label : "");

    // Clear previous accommodation selection
    unregister(`itinerary.${index}.accommodation`);
    setValue(`itinerary.${index}.accommodation`, null);
    setValue(`itinerary.${index}.accommodationName`, "");

    // Fetch accommodations for the selected destination
    if (selected) {
      await fetchAccommodations(selected.value, fieldId);
    } else {
      // If destination is deselected, clear accommodations
      setValue(`itinerary.${index}.accommodation`, null);
      setValue(`itinerary.${index}.accommodationName`, "");
    }
  };

  /**
   * Handler for accommodation selection change.
   * Updates the form value.
   *
   * @param {Object} selected - Selected accommodation option.
   */
  const handleAccommodationChange = (selected) => {
    // Update the form value for accommodation
    setValue(`itinerary.${index}.accommodation`, selected);
    // Also store the accommodation name
    setValue(`itinerary.${index}.accommodationName`, selected ? selected.label : "");
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="border p-4 mb-4 bg-white rounded shadow">
      {/* Header with Day Number and Remove Button */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">Day {index + 1}</h4>
        <button
          type="button"
          onClick={() => remove(index)}
          className="text-red-500 hover:text-red-700"
          title="Remove Day"
        >
          <FaTrash />
        </button>
      </div>

      {/* Itinerary Title */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Itinerary Title<span className="text-red-500">*</span>
        </label>
        <Controller
          name={`itinerary.${index}.title`}
          control={control}
          rules={{
            required: "Itinerary Title is required",
            minLength: {
              value: 3,
              message: "Itinerary Title must be at least 3 characters",
            },
          }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              className="w-full p-2 border rounded"
              placeholder="Enter Itinerary Title"
            />
          )}
        />
        {errors.itinerary?.[index]?.title && (
          <p className="text-red-500 text-sm mt-1">
            {errors.itinerary[index].title.message}
          </p>
        )}
      </div>

      {/* Destination and Accommodation in the same row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Destination Selection */}
        <div>
          <label className="block mb-1 font-semibold">
            Destination<span className="text-red-500">*</span>
          </label>
          <Controller
            name={`itinerary.${index}.destination`}
            control={control}
            rules={{
              required: "Destination is required",
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={destinations}
                placeholder="Select Destination"
                isLoading={false} // Assuming destinations are pre-fetched
                onChange={handleDestinationChange}
                value={field.value}
              />
            )}
          />
          {errors.itinerary?.[index]?.destination && (
            <p className="text-red-500 text-sm mt-1">
              {errors.itinerary[index].destination.message}
            </p>
          )}

          {/* Display Destination Images */}
          {selectedDestination && selectedDestination.images && selectedDestination.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedDestination.images.map((image, imgIndex) => (
                <Image
                  key={imgIndex}
                  src={image.url || "/placeholder.png"} // Replace with actual image handling
                  alt={`Destination Image ${imgIndex + 1}`}
                  width={80}
                  height={60}
                  className="object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>

        {/* Accommodation Selection */}
        <div>
          <label className="block mb-1 font-semibold">
            Accommodation<span className="text-red-500">*</span>
          </label>
          <Controller
            name={`itinerary.${index}.accommodation`}
            control={control}
            rules={{
              required: "Accommodation is required",
            }}
            render={({ field }) => (
              <Select
                {...field}
                options={accommodations}
                placeholder="Select Accommodation"
                isLoading={isLoadingAccommodations}
                isDisabled={!selectedDestination}
                onChange={handleAccommodationChange}
                value={field.value}
              />
            )}
          />
          {errors.itinerary?.[index]?.accommodation && (
            <p className="text-red-500 text-sm mt-1">
              {errors.itinerary[index].accommodation.message}
            </p>
          )}

          {/* Display Accommodation Images */}
          {selectedAccommodation && selectedAccommodation.images && selectedAccommodation.images.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedAccommodation.images.map((image, imgIndex) => (
                <Image
                  key={imgIndex}
                  src={image.url || "/placeholder.png"} // Replace with actual image handling
                  alt={`Accommodation Image ${imgIndex + 1}`}
                  width={80}
                  height={60}
                  className="object-cover rounded"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Itinerary Description */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Itinerary Description<span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <Controller
            name={`itinerary.${index}.description`}
            control={control}
            rules={{
              required: "Itinerary Description is required",
            }}
            render={({ field }) => (
              <CKEditor
                editor={ClassicEditor}
                data={field.value || ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  field.onChange(data);
                }}
              />
            )}
          />
        </div>
        {errors.itinerary?.[index]?.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.itinerary[index].description.message}
          </p>
        )}
      </div>

      {/* Meal Plan */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Meal Plan<span className="text-red-500">*</span>
        </label>
        <Controller
          name={`itinerary.${index}.meals`}
          control={control}
          rules={{
            required: "Please select at least one meal option",
          }}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: "Breakfast", label: "Breakfast" },
                { value: "Half Board", label: "Half Board" },
                { value: "Full Board", label: "Full Board" },
                { value: "All Inclusive", label: "All Inclusive" },
              ]}
              isMulti
              placeholder="Select Meal Plans"
              onChange={(selectedOptions) => {
                field.onChange(selectedOptions);
              }}
              value={field.value}
            />
          )}
        />
        {errors.itinerary?.[index]?.meals && (
          <p className="text-red-500 text-sm mt-1">
            {errors.itinerary[index].meals.message}
          </p>
        )}
      </div>

      {/* Optional Fields: Time, Distance, Max Altitude */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time */}
        <div>
          <label className="block mb-1 font-semibold">
            Time (hours)
          </label>
          <Controller
            name={`itinerary.${index}.time`}
            control={control}
            rules={{
              min: {
                value: 1,
                message: "Minimum time is 1 hour",
              },
            }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                className="w-full p-2 border rounded"
                placeholder="e.g., 3"
                min="1"
              />
            )}
          />
          {errors.itinerary?.[index]?.time && (
            <p className="text-red-500 text-sm mt-1">
              {errors.itinerary[index].time.message}
            </p>
          )}
        </div>

        {/* Distance */}
        <div>
          <label className="block mb-1 font-semibold">
            Distance (km)
          </label>
          <Controller
            name={`itinerary.${index}.distance`}
            control={control}
            rules={{
              min: {
                value: 1,
                message: "Minimum distance is 1 km",
              },
            }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                className="w-full p-2 border rounded"
                placeholder="e.g., 50"
                min="1"
              />
            )}
          />
          {errors.itinerary?.[index]?.distance && (
            <p className="text-red-500 text-sm mt-1">
              {errors.itinerary[index].distance.message}
            </p>
          )}
        </div>

        {/* Max Altitude */}
        <div>
          <label className="block mb-1 font-semibold">
            Max Altitude (m)
          </label>
          <Controller
            name={`itinerary.${index}.maxAltitude`}
            control={control}
            rules={{
              min: {
                value: 0,
                message: "Altitude cannot be negative",
              },
            }}
            render={({ field }) => (
              <input
                type="number"
                {...field}
                className="w-full p-2 border rounded"
                placeholder="e.g., 1500"
                min="0"
              />
            )}
          />
          {errors.itinerary?.[index]?.maxAltitude && (
            <p className="text-red-500 text-sm mt-1">
              {errors.itinerary[index].maxAltitude.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SortableItem;
