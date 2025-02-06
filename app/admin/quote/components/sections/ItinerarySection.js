// app/admin/quote/components/sections/ItinerarySection.js

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import { FaTrash, FaPlus } from "react-icons/fa";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; // Ensure 'db' is correctly exported from your firebase config
import Image from "next/image";

// Importing DnD Kit components for drag-and-drop functionality
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Import react-toastify for notifications
import { toast } from "react-toastify";

/**
 * Helper function to construct image URLs from Firestore image objects.
 * Handles both 'url' and 'storagePath' fields.
 *
 * @param {Object} image - Image object containing either 'url' or 'storagePath'.
 * @param {string} bucket - Firebase Storage bucket name.
 * @returns {string|null} - Constructed image URL or null if invalid.
 */
const constructImageURL = (image, bucket) => {
  if (!image) return null;
  if (image.url) {
    return image.url;
  } else if (image.storagePath) {
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
      image.storagePath
    )}?alt=media`;
  }
  return null;
};

/**
 * SortableItem Component
 *
 * Represents a single itinerary day with all its fields, associated images, and activities.
 */
const SortableItem = ({
  id,
  index,
  remove,
  destinations,
  accommodations,
  isLoadingAccommodations,
  fetchAccommodations,
  unregister,
  setValue,
  firebaseBucket,
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
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const itineraryWatch = watch("itinerary");
  const selectedDestination = itineraryWatch?.[index]?.destination;
  const selectedAccommodation = itineraryWatch?.[index]?.accommodation;
  const coordinates = itineraryWatch?.[index]?.coordinates;

  /**
   * Handler for destination selection change.
   * Updates the form value and fetches relevant accommodations.
   *
   * @param {Object} selected - Selected destination option.
   */
  const handleDestinationChange = async (selected) => {
    // Update the form value for destination
    setValue(`itinerary.${index}.destination`, selected);

    // Store title
    setValue(`itinerary.${index}.title`, selected ? selected.label : "");

    // Store coordinates
    setValue(
      `itinerary.${index}.coordinates`,
      selected ? { lat: selected.lat, lng: selected.lng } : null
    );

    // Clear previous accommodation selection
    unregister(`itinerary.${index}.accommodation`);
    unregister(`itinerary.${index}.accommodationName`);
    setValue(`itinerary.${index}.accommodation`, null);
    setValue(`itinerary.${index}.accommodationName`, "");

    // Fetch accommodations for the selected destination
    if (selected) {
      await fetchAccommodations(selected.value, id);
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
    // Store accommodation name
    setValue(
      `itinerary.${index}.accommodationName`,
      selected ? selected.label : ""
    );
  };

  // **Activities Management**

  // Initialize activities field array for this itinerary day
  const {
    fields: activityFields,
    append: appendActivity,
    remove: removeActivity,
  } = useFieldArray({
    control,
    name: `itinerary.${index}.activities`,
  });

  /**
   * Adds a new activity to the current itinerary day.
   */
  const addActivity = () => {
    appendActivity({ activityName: "" });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border p-6 mb-6 bg-gray-50 shadow rounded-lg"
    >
      {/* Header with Day Number and Remove Button */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xl font-semibold text-gray-800">Day {index + 1}</h4>
        <div className="flex items-center space-x-2">
          {/* Drag Handle */}
          <span
            {...listeners}
            {...attributes}
            className="cursor-move text-gray-500 hover:text-gray-700"
            title="Drag to reorder"
          >
            &#x2630;
          </span>
          {/* Remove Button */}
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500 hover:text-red-700"
            title="Remove Day"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>

      {/* Title Field */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Title <span className="text-red-500">*</span>
        </label>
        <Controller
          name={`itinerary.${index}.title`}
          control={control}
          rules={{
            required: "Title is required",
            minLength: {
              value: 5,
              message: "Title must be at least 5 characters",
            },
            maxLength: {
              value: 100,
              message: "Title must be at most 100 characters",
            },
          }}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring ${
                errors.itinerary?.[index]?.title
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter Itinerary Title"
            />
          )}
        />
        {errors.itinerary?.[index]?.title && (
          <p className="mt-2 text-sm text-red-600">
            {errors.itinerary[index].title.message}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Description <span className="text-red-500">*</span>
        </label>
        <div
          className={`border rounded-md overflow-hidden ${
            errors.itinerary?.[index]?.description
              ? "border-red-500"
              : "border-gray-300"
          }`}
        >
          <Controller
            name={`itinerary.${index}.description`}
            control={control}
            rules={{
              required: "Description is required",
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
          <p className="mt-2 text-sm text-red-600">
            {errors.itinerary[index].description.message}
          </p>
        )}
      </div>

      {/* Grouped Destinations and Accommodations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Destination Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Destination <span className="text-red-500">*</span>
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
                isLoading={false}
                onChange={handleDestinationChange}
                classNamePrefix="react-select"
              />
            )}
          />
          {errors.itinerary?.[index]?.destination && (
            <p className="mt-2 text-sm text-red-600">
              {errors.itinerary[index].destination.message}
            </p>
          )}

          {/* Display Destination Title and Coordinates */}
          {selectedDestination && coordinates && (
            <div className="mt-4 text-sm text-gray-700">
              <p>
                <strong>Destination Title:</strong> {selectedDestination.label}
              </p>
              <p>
                <strong>Coordinates:</strong> Lat {coordinates.lat}, Lng{" "}
                {coordinates.lng}
              </p>
            </div>
          )}

          {/* Display Destination Images */}
          {selectedDestination &&
            selectedDestination.images &&
            selectedDestination.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedDestination.images.map((image, imgIndex) => {
                  const imageURL = constructImageURL(image, firebaseBucket);
                  return imageURL ? (
                    <Image
                      key={imgIndex}
                      src={imageURL}
                      alt={`Destination Image ${imgIndex + 1}`}
                      width={80}
                      height={60}
                      className="object-cover rounded-md"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      key={imgIndex}
                      className="w-24 h-18 bg-gray-200 rounded-md"
                    ></div>
                  );
                })}
              </div>
            )}
        </div>

        {/* Accommodation Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Accommodation <span className="text-red-500">*</span>
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
                placeholder={
                  isLoadingAccommodations
                    ? "Loading accommodations..."
                    : "Select Accommodation"
                }
                isLoading={isLoadingAccommodations}
                isDisabled={!selectedDestination}
                onChange={handleAccommodationChange}
                classNamePrefix="react-select"
              />
            )}
          />
          {errors.itinerary?.[index]?.accommodation && (
            <p className="mt-2 text-sm text-red-600">
              {errors.itinerary[index].accommodation.message}
            </p>
          )}

          {/* Display Accommodation Name */}
          {selectedAccommodation && (
            <div className="mt-4 text-sm text-gray-700">
              <p>
                <strong>Accommodation Name:</strong>{" "}
                {selectedAccommodation.label}
              </p>
            </div>
          )}

          {/* Display Accommodation Images */}
          {selectedAccommodation &&
            selectedAccommodation.images &&
            selectedAccommodation.images.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedAccommodation.images.map((image, imgIndex) => {
                  const imageURL = constructImageURL(image, firebaseBucket);
                  return imageURL ? (
                    <Image
                      key={imgIndex}
                      src={imageURL}
                      alt={`Accommodation Image ${imgIndex + 1}`}
                      width={80}
                      height={65}
                      className="object-cover rounded-md"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      key={imgIndex}
                      className="w-24 h-18 bg-gray-200 rounded-md"
                    ></div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* Meals Selection */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Meals <span className="text-red-500">*</span>
        </label>
        <Controller
          name={`itinerary.${index}.meals`}
          control={control}
          rules={{
            validate: (value) =>
              value && value.length > 0
                ? true
                : "Please select at least one meal option",
          }}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={[
                { value: "Breakfast", label: "Breakfast" },
                { value: "Half Board", label: "Half Board" },
                { value: "Full Board", label: "Full Board" },
                { value: "All Inclusive", label: "All Inclusive" },
              ]}
              placeholder="Select Meals"
              onChange={(selectedOptions) => {
                field.onChange(selectedOptions);
              }}
              classNamePrefix="react-select"
            />
          )}
        />
        {errors.itinerary?.[index]?.meals && (
          <p className="mt-2 text-sm text-red-600">
            {errors.itinerary[index].meals.message}
          </p>
        )}
      </div>

      {/* **Activities Section** */}
      <div className="mb-6">
        <label className="block mb-2 font-medium text-gray-700">
          Activities
        </label>
        {activityFields.map((activity, activityIndex) => (
          <div key={activity.id} className="flex items-center mb-2">
            <Controller
              name={`itinerary.${index}.activities.${activityIndex}.activityName`}
              control={control}
              rules={{
                required: "Activity name is required",
                minLength: {
                  value: 3,
                  message: "Activity name must be at least 3 characters",
                },
              }}
              render={({ field }) => (
                <input
                  type="text"
                  {...field}
                  className={`flex-1 p-2 border rounded-md focus:outline-none focus:ring ${
                    errors.itinerary?.[index]?.activities?.[activityIndex]
                      ?.activityName
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder={`Activity ${activityIndex + 1}`}
                />
              )}
            />
            <button
              type="button"
              onClick={() => removeActivity(activityIndex)}
              className="ml-2 text-red-500 hover:text-red-700"
              title="Remove Activity"
            >
              <FaTrash />
            </button>
          </div>
        ))}
        {errors.itinerary?.[index]?.activities &&
          errors.itinerary[index].activities.map(
            (activityError, activityIndex) =>
              activityError?.activityName && (
                <p key={activityIndex} className="text-red-500 text-sm mt-1">
                  {activityError.activityName.message}
                </p>
              )
          )}
        <button
          type="button"
          onClick={addActivity}
          className="mt-2 flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <FaPlus className="mr-1" />
          Add Activity
        </button>
      </div>
      {/* End of Activities Section */}

      {/* Optional Fields: Time, Distance, Max Altitude */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Time */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
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
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring ${
                  errors.itinerary?.[index]?.time
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="e.g., 3"
                min="1"
              />
            )}
          />
          {errors.itinerary?.[index]?.time && (
            <p className="mt-2 text-sm text-red-600">
              {errors.itinerary[index].time.message}
            </p>
          )}
        </div>

        {/* Distance */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
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
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring ${
                  errors.itinerary?.[index]?.distance
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="e.g., 50"
                min="1"
              />
            )}
          />
          {errors.itinerary?.[index]?.distance && (
            <p className="mt-2 text-sm text-red-600">
              {errors.itinerary[index].distance.message}
            </p>
          )}
        </div>

        {/* Max Altitude */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">
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
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring ${
                  errors.itinerary?.[index]?.maxAltitude
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="e.g., 1500"
                min="0"
              />
            )}
          />
          {errors.itinerary?.[index]?.maxAltitude && (
            <p className="mt-2 text-sm text-red-600">
              {errors.itinerary[index].maxAltitude.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * ItinerarySection Component
 *
 * Manages the itinerary creation step, including adding/removing days and handling drag-and-drop.
 */
const ItinerarySection = ({ isEdit, existingData }) => {
  const { control, setValue, unregister, reset } = useFormContext();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "itinerary",
  });

  const [destinations, setDestinations] = useState([]);
  const [accommodations, setAccommodations] = useState({});
  const [isLoadingAccommodations, setIsLoadingAccommodations] = useState({});

  // Read the storage bucket from environment variable
  const FIREBASE_STORAGE_BUCKET =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-firebase-bucket"; // Replace with your actual bucket name

  /**
   * Fetches accommodations based on the selected destination.
   *
   * @param {string} destinationId - ID of the selected destination.
   * @param {string} fieldId - Unique ID of the itinerary day.
   */
  const fetchAccommodations = useCallback(async (destinationId, fieldId) => {
    setIsLoadingAccommodations((prev) => ({
      ...prev,
      [fieldId]: true,
    }));
    try {
      const q = query(
        collection(db, "accommodations"),
        where("destinationId", "==", destinationId)
      );
      const querySnapshot = await getDocs(q);
      const accommodationsData = querySnapshot.docs.map((doc) => ({
        value: doc.id,
        label: doc.data().name,
        images: doc.data().images || [],
      }));
      setAccommodations((prev) => ({
        ...prev,
        [fieldId]: accommodationsData,
      }));
    } catch (error) {
      console.error("Error fetching accommodations:", error);
      toast.error("Failed to fetch accommodations.");
    } finally {
      setIsLoadingAccommodations((prev) => ({
        ...prev,
        [fieldId]: false,
      }));
    }
  }, []);

  /**
   * Fetches destinations from Firestore upon component mount.
   */
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "destinations"));
        const destinationsData = querySnapshot.docs.map((doc) => ({
          value: doc.id,
          label: doc.data().title,
          lat: doc.data().coordinates?.lat, // Updated to access coordinates.lat
          lng: doc.data().coordinates?.lng, // Updated to access coordinates.lng
          images: doc.data().images || [],
        }));
        setDestinations(destinationsData);
      } catch (error) {
        console.error("Error fetching destinations:", error);
        toast.error("Failed to fetch destinations.");
      }
    };

    fetchDestinations();
  }, []);

  /**
   * Initialize the form with existingData?.itinerary || [default itinerary]
   */
  useEffect(() => {
    if (isEdit && existingData?.itinerary) {
      reset({
        itinerary: existingData.itinerary.map((day) => ({
          ...day,
          activities: day.activities || [], // Ensure activities field exists
        })),
      });
    } else if (!isEdit && fields.length === 0) {
      append({
        title: "",
        description: "",
        destination: null,
        title: "",
        coordinates: null,
        accommodation: null,
        accommodationName: "",
        meals: [],
        activities: [], // Initialize activities as an empty array
        time: "",
        distance: "",
        maxAltitude: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, existingData, append, reset, fields.length]);

  /**
   * Initialize DnD sensors
   */
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Handles the end of a drag event to reorder itinerary days.
   *
   * @param {Object} event - Drag event object.
   */
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  /**
   * Adds a new itinerary day with default values.
   */
  const addDay = () => {
    if (fields.length >= 10) {
      // Limit to 10 days
      toast.warn("You can add a maximum of 10 itinerary days.");
      return;
    }
    append({
      title: "",
      description: "",
      destination: null,
      title: "",
      coordinates: null,
      accommodation: null,
      accommodationName: "",
      meals: [],
      activities: [], // Initialize activities as an empty array
      time: "",
      distance: "",
      maxAltitude: "",
    });
  };

  /**
   * Removes an itinerary day using the index.
   *
   * @param {number} index - Index of the itinerary day to remove.
   */
  const removeDay = (index) => {
    const fieldId = fields[index]?.id;
    remove(index);
    if (fieldId) {
      setAccommodations((prev) => {
        const newAccommodations = { ...prev };
        delete newAccommodations[fieldId];
        return newAccommodations;
      });
      setIsLoadingAccommodations((prev) => {
        const newLoading = { ...prev };
        delete newLoading[fieldId];
        return newLoading;
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      {/* Render each itinerary day */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fields.map((field) => field.id)}
          strategy={verticalListSortingStrategy}
        >
          {fields.map((field, index) => (
            <SortableItem
              key={field.id}
              id={field.id}
              index={index}
              remove={removeDay}
              destinations={destinations}
              accommodations={accommodations[field.id] || []}
              isLoadingAccommodations={
                isLoadingAccommodations[field.id] || false
              }
              fetchAccommodations={fetchAccommodations}
              unregister={unregister}
              setValue={setValue}
              firebaseBucket={FIREBASE_STORAGE_BUCKET}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add Day Button */}
      <button
        type="button"
        onClick={addDay}
        className="mt-4 flex items-center px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <FaPlus className="mr-2" />
        Add Day
      </button>
    </div>
  );
};

export default ItinerarySection;
