"use client";

import React, { useEffect, useState, useCallback, useContext } from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import { FaTrash, FaPlus } from "react-icons/fa";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "@/app/lib/firebase"; // Ensure 'storage' is exported from your firebase config
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

// Import FormContext
import { FormContext } from "../FormContext";

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
    return image.url; // Use the URL directly without additional encoding
  } else if (image.storagePath) {
    // Encode the storagePath only once
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
      image.storagePath
    )}?alt=media`;
  }
  return null;
};

/**
 * SortableItem Component
 *
 * Represents a single itinerary day with all its fields and associated images.
 */
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

    // Also store the destination name
    setValue(
      `itinerary.${index}.destinationName`,
      selected ? selected.label : ""
    );

    // Store coordinates
    setValue(
      `itinerary.${index}.coordinates`,
      selected && selected.coordinates
        ? { lat: selected.coordinates.lat, lng: selected.coordinates.lng }
        : null
    );

    // Clear previous accommodation selection
    unregister(`itinerary.${index}.accommodation`);
    unregister(`itinerary.${index}.accommodationName`);
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
    setValue(
      `itinerary.${index}.accommodationName`,
      selected ? selected.label : ""
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border p-4 mb-4 bg-white shadow rounded"
    >
      {/* Header with Day Number and Remove Button */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">Day {index + 1}</h4>
        <div className="flex space-x-2">
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
            <FaTrash />
          </button>
        </div>
      </div>

      {/* Title Field */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Title<span className="text-red-500">*</span>
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
              className="p-2 border rounded w-full"
              placeholder="Enter Itinerary Title"
            />
          )}
        />
        {errors.itinerary?.[index]?.title && (
          <p className="text-red-500">
            {errors.itinerary[index].title.message}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Description<span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
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
          <p className="text-red-500">
            {errors.itinerary[index].description.message}
          </p>
        )}
      </div>

      {/* Grouped Destinations and Accommodations */}
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
            <p className="text-red-500">
              {errors.itinerary[index].destination.message}
            </p>
          )}

          {/* Display Coordinates Before Images */}
          {coordinates &&
            coordinates.lat != null &&
            coordinates.lng != null && (
              <p className="mt-2">
                <strong>Coordinates:</strong> Lat {coordinates.lat}, Lng{" "}
                {coordinates.lng}
              </p>
            )}
          {!coordinates && (
            <p className="mt-2 text-gray-500">
              <em>No coordinates available for this destination.</em>
            </p>
          )}

          {/* Display Destination Images within the Left Div */}
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
                      className="object-cover rounded"
                      unoptimized // Temporarily disable optimization for debugging
                    />
                  ) : (
                    <div
                      key={imgIndex}
                      className="w-20 h-15 bg-gray-200 rounded"
                    ></div>
                  );
                })}
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
            <p className="text-red-500">
              {errors.itinerary[index].accommodation.message}
            </p>
          )}

          {/* Display Accommodation Images within the Right Div */}
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
                      height={60}
                      className="object-cover rounded"
                      unoptimized // Temporarily disable optimization for debugging
                    />
                  ) : (
                    <div
                      key={imgIndex}
                      className="w-20 h-15 bg-gray-200 rounded"
                    ></div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {/* Meals Selection */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Meals<span className="text-red-500">*</span>
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
                { value: "Lunch", label: "Lunch" },
                { value: "Dinner", label: "Dinner" },
                { value: "No Meals", label: "No Meals" },
                { value: "Drinks", label: "Drinks" },
              ]}
              placeholder="Select Meals"
              onChange={(selectedOptions) => {
                field.onChange(selectedOptions);
              }}
              value={field.value}
            />
          )}
        />
        {errors.itinerary?.[index]?.meals && (
          <p className="text-red-500">
            {errors.itinerary[index].meals.message}
          </p>
        )}

        {/* Optionally Display Coordinates Again (if needed) */}
        {/* You can remove this if it's redundant */}
        {coordinates && coordinates.lat != null && coordinates.lng != null && (
          <p className="mt-2">
            <strong>Coordinates:</strong> Lat {coordinates.lat}, Lng{" "}
            {coordinates.lng}
          </p>
        )}
      </div>

      {/* Optional Fields: Time, Distance, Max Altitude */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Time */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Time (hours)</label>
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
                className="p-2 border rounded w-full"
                placeholder="e.g., 3"
                min="1"
              />
            )}
          />
          {errors.itinerary?.[index]?.time && (
            <p className="text-red-500">
              {errors.itinerary[index].time.message}
            </p>
          )}
        </div>

        {/* Distance */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Distance (km)</label>
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
                className="p-2 border rounded w-full"
                placeholder="e.g., 50"
                min="1"
              />
            )}
          />
          {errors.itinerary?.[index]?.distance && (
            <p className="text-red-500">
              {errors.itinerary[index].distance.message}
            </p>
          )}
        </div>

        {/* Max Altitude */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Max Altitude (m)</label>
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
                className="p-2 border rounded w-full"
                placeholder="e.g., 1500"
                min="0"
              />
            )}
          />
          {errors.itinerary?.[index]?.maxAltitude && (
            <p className="text-red-500">
              {errors.itinerary[index].maxAltitude.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Step2ItineraryMain Component
 *
 * Manages the itinerary creation step, including adding/removing days and handling drag-and-drop.
 */
const Step2ItineraryMain = ({ isEdit }) => {
  const {
    control,
    formState,
    clearErrors,
    setValue,
    unregister,
    reset,
    trigger,
  } = useFormContext();

  // Destructure formData from FormContext
  const {
    formData, // Ensure formData is destructured
    currentStep,
    nextStep,
    prevStep,
  } = useContext(FormContext);

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
  console.log("FIREBASE_STORAGE_BUCKET:", FIREBASE_STORAGE_BUCKET); // Debug log

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
          images: doc.data().images || [],
          coordinates: {
            lat: doc.data().coordinates?.lat, // Fetch latitude
            lng: doc.data().coordinates?.lng, // Fetch longitude
          },
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
   * Fetches existing package data if in edit mode.
   */
  useEffect(() => {
    if (isEdit && formData.id) {
      // Ensure both isEdit and formData.id are present
      const fetchPackageData = async () => {
        try {
          const packageDoc = await getDoc(doc(db, "tourPackages", formData.id));
          if (packageDoc.exists()) {
            const data = packageDoc.data();
            // Populate form fields from data
            reset(data);
            // Fetch accommodations for each itinerary day
            if (data.itinerary && Array.isArray(data.itinerary)) {
              data.itinerary.forEach((day, index) => {
                if (day.destination) {
                  const fieldId = fields[index]?.id;
                  if (fieldId) {
                    fetchAccommodations(day.destination.value, fieldId);
                  }
                }
              });
            }
          } else {
            console.error("Package not found");
            toast.error("Package not found.");
          }
        } catch (error) {
          console.error("Error fetching package data:", error);
          toast.error("Failed to load package data.");
        }
      };

      fetchPackageData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, formData.id]); // Ensure formData.id is a dependency

  /**
   * Initialize the form with one itinerary day if none exist.
   */
  useEffect(() => {
    if (fields.length === 0) {
      addDay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // Accommodations and loading states remain correctly associated with fieldId
    }
  };

  /**
   * Adds a new itinerary day with default values.
   */
  const addDay = () => {
    append({
      title: "",
      description: "",
      destination: null,
      destinationName: "", // To store destination name
      coordinates: null, // To store coordinates
      accommodation: null,
      accommodationName: "", // To store accommodation name
      meals: [],
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

  /**
   * Handles moving to the next step in the form.
   */
  const handleNext = () => {
    // Clear any potential errors
    clearErrors();

    // Validate the entire form before proceeding
    trigger().then((isValid) => {
      if (isValid) {
        // Proceed to the next step
        nextStep();
      } else {
        toast.error("Please fix the errors in the form before proceeding.");
      }
    });
  };

  /**
   * Handles moving to the previous step in the form.
   */
  const handleBack = () => {
    prevStep();
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
              fieldId={field.id} // Pass fieldId
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

      {/* Add Day Button with Green Background */}
      <button
        type="button"
        onClick={addDay}
        className="bg-green-500 text-white px-4 py-2 rounded flex items-center mt-2 hover:bg-green-600 transition-colors"
      >
        <FaPlus className="mr-2" /> Add Day
      </button>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={handleBack}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleNext}
          className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors ${
            !formState.isValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!formState.isValid}
        >
          Next
        </button>
      </div>
    </div>
  );
};

/**
 * SortableItem Component does not need PropTypes
 */

export default Step2ItineraryMain;
