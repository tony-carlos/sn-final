"use client";

import React, { useEffect, useContext, useState, useRef } from "react";
import { useFormContext, Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import axios from "axios";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { FormContext } from "../FormContext";
import { toast } from "react-toastify";
import generateSlug from "../../utils/generateSlug";
import Image from "next/image";

/**
 * Step1BasicInfo Component
 *
 * Handles the Basic Information step in the tour package form.
 * Captures details like tour title, description, tags, main focus, group type,
 * country, starting and ending destinations, duration, and various flags.
 */
const Step1BasicInfo = ({ isEdit }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
  } = useFormContext();

  const { formData, updateFormData, nextStep, prevStep } =
    useContext(FormContext);

  const [countries, setCountries] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [tagsOptions, setTagsOptions] = useState([]);
  const [checkingTitle, setCheckingTitle] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const [errorCountries, setErrorCountries] = useState(null);
  const [errorDestinations, setErrorDestinations] = useState(null);

  const initialTitleRef = useRef("");

  // Fetch data on component mount
  useEffect(() => {
    // Fetch country options from REST Countries API
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v2/all");
        const countryOptions = response.data.map((country) => ({
          value: country.name,
          label: country.name,
        }));
        setCountries(countryOptions);
        setLoadingCountries(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setErrorCountries("Failed to load countries.");
        setLoadingCountries(false);
        toast.error("Failed to fetch countries.");
      }
    };

    // Fetch destinations from Firestore
    const fetchDestinations = async () => {
      try {
        const q = query(collection(db, "destinations"));
        const querySnapshot = await getDocs(q);
        const destinationOptions = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          destinationOptions.push({
            value: doc.id,
            label: data.title,
            coordinates: {
              lat: data.coordinates?.lat,
              lng: data.coordinates?.lng,
            },
            images: data.images || [], // If you plan to display images in step1
          });
        });
        setDestinations(destinationOptions);
        setLoadingDestinations(false);
      } catch (error) {
        console.error("Error fetching destinations:", error);
        setErrorDestinations("Failed to load destinations.");
        setLoadingDestinations(false);
        toast.error("Failed to fetch destinations.");
      }
    };

    // Define Tags Options
    const fetchTags = () => {
      const tags = [
        { value: "Adventure", label: "Adventure" },
        { value: "Wildlife", label: "Wildlife" },
        { value: "Cultural", label: "Cultural" },
        { value: "Beach", label: "Beach" },
        { value: "Mountain", label: "Mountain" },
        { value: "Hiking", label: "Hiking" },
        { value: "Safari", label: "Safari" },
        { value: "Nature", label: "Nature" },
        { value: "Family", label: "Family" },
        { value: "Romantic", label: "Romantic" },
        { value: "Historical", label: "Historical" },
        { value: "Budget", label: "Budget" },
        { value: "Luxury", label: "Luxury" },
        { value: "Group", label: "Group" },
        { value: "Solo", label: "Solo" },
        // Add more tags as needed
      ];
      setTagsOptions(tags);
    };

    // Initialize data fetching
    fetchCountries();
    fetchDestinations();
    fetchTags();
  }, []);

  // Extract watched fields into variables for useEffect dependencies
  const tourTitle = watch("basicInfo.tourTitle");
  const minPeople = watch("basicInfo.minPeople");

  // Watch for Tour Title changes to generate slug
  const watchedTourTitle = watch("basicInfo.tourTitle");

  // Watch 'from' and 'ends' fields to get selected options
  const selectedFrom = useWatch({
    control,
    name: "basicInfo.from",
  });

  const selectedEnds = useWatch({
    control,
    name: "basicInfo.ends",
  });

  // Local state to store coordinates
  const [fromCoordinates, setFromCoordinates] = useState(null);
  const [endsCoordinates, setEndsCoordinates] = useState(null);

  // Update coordinates when 'from' changes
  useEffect(() => {
    if (selectedFrom && selectedFrom.coordinates) {
      const { lat, lng } = selectedFrom.coordinates;
      if (lat != null && lng != null) {
        setFromCoordinates({ lat, lng });
      } else {
        setFromCoordinates(null);
      }
    } else {
      setFromCoordinates(null);
    }
  }, [selectedFrom]);

  // Update coordinates when 'ends' changes
  useEffect(() => {
    if (selectedEnds && selectedEnds.coordinates) {
      const { lat, lng } = selectedEnds.coordinates;
      if (lat != null && lng != null) {
        setEndsCoordinates({ lat, lng });
      } else {
        setEndsCoordinates(null);
      }
    } else {
      setEndsCoordinates(null);
    }
  }, [selectedEnds]);

  // Set initial values when editing
  useEffect(() => {
    if (isEdit && formData.basicInfo) {
      // Set default values if they exist
      Object.keys(formData.basicInfo).forEach((key) => {
        setValue(`basicInfo.${key}`, formData.basicInfo[key]);
      });
      // If slug exists, set it
      if (formData.basicInfo.slug) {
        setValue("basicInfo.slug", formData.basicInfo.slug);
      }
      // Store the initial tour title
      initialTitleRef.current = formData.basicInfo.tourTitle;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, formData.basicInfo]);

  // Check for Tour Title uniqueness
  useEffect(() => {
    const checkTitleUnique = async (title) => {
      if (title && title.length >= 10 && title.length <= 60) {
        setCheckingTitle(true);
        try {
          const q = query(
            collection(db, "tourPackages"),
            where("basicInfo.tourTitle", "==", title)
          );
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Filter out the current package being edited
            const conflictingPackages = querySnapshot.docs.filter(
              (doc) => doc.id !== formData.id // Exclude current package
            );

            if (conflictingPackages.length > 0) {
              // Title exists in another package
              setError("basicInfo.tourTitle", {
                type: "manual",
                message: "Tour Title already exists.",
              });
              toast.error("Tour Title already exists.");
            } else {
              // No conflict, clear any existing errors
              clearErrors("basicInfo.tourTitle");
            }
          } else {
            // No conflict, clear any existing errors
            clearErrors("basicInfo.tourTitle");
          }
        } catch (error) {
          console.error("Error checking tour title uniqueness:", error);
          toast.error("Failed to check Tour Title uniqueness.");
        } finally {
          setCheckingTitle(false);
        }
      } else {
        // If title doesn't meet length requirements, clear errors
        clearErrors("basicInfo.tourTitle");
      }
    };

    // Determine if the tour title has been modified
    const isTitleModified = tourTitle !== initialTitleRef.current;

    if (tourTitle && isTitleModified) {
      // Debounce the uniqueness check to prevent excessive calls
      const delayDebounceFn = setTimeout(() => {
        checkTitleUnique(tourTitle);
      }, 500); // Adjust the delay as needed

      return () => clearTimeout(delayDebounceFn);
    } else {
      // If tourTitle is not modified or is empty, clear errors
      if (!isTitleModified) {
        clearErrors("basicInfo.tourTitle");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourTitle, formData.id]);

  // Generate slug whenever the Tour Title changes and is modified
  useEffect(() => {
    const generateUniqueSlug = async (title) => {
      if (title) {
        let baseSlug = generateSlug(title);
        let uniqueSlug = baseSlug;
        let counter = 1;

        while (true) {
          // Query to check if the slug exists in other packages
          const q = query(
            collection(db, "tourPackages"),
            where("basicInfo.slug", "==", uniqueSlug)
          );
          const querySnapshot = await getDocs(q);

          if (
            querySnapshot.empty ||
            (isEdit &&
              querySnapshot.docs.length === 1 &&
              querySnapshot.docs[0].id === formData.id)
          ) {
            // Slug is unique or belongs to the current package being edited
            break;
          } else {
            // Slug exists in another package, append a counter
            uniqueSlug = `${baseSlug}-${counter}`;
            counter += 1;
          }
        }

        setValue("basicInfo.slug", uniqueSlug, {
          shouldValidate: true,
          shouldDirty: true,
        });
      } else {
        setValue("basicInfo.slug", "", {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    };

    // Determine if the tour title has been modified
    const isTitleModified = watchedTourTitle !== initialTitleRef.current;

    if (watchedTourTitle && isTitleModified) {
      // Debounce the slug generation to prevent excessive calls
      const delayDebounceFn = setTimeout(() => {
        generateUniqueSlug(watchedTourTitle);
      }, 500); // Adjust the delay as needed

      return () => clearTimeout(delayDebounceFn);
    } else if (!isTitleModified) {
      // If title is not modified, ensure slug remains unchanged
      setValue("basicInfo.slug", formData.basicInfo.slug, {
        shouldValidate: true,
        shouldDirty: true,
      });
    } else {
      // If title is empty, clear slug
      setValue("basicInfo.slug", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedTourTitle, isEdit, formData.id]);

  /**
   * Handles form submission.
   *
   * @param {Object} data - The form data.
   */
  const onSubmit = (data) => {
    // Save the current step's data to context using the correct function name
    updateFormData("basicInfo", data.basicInfo);
    // Proceed to the next step
    nextStep();
    toast.success("Basic Information saved!");
  };

  /**
   * Handles the "Back" button click.
   */
  const handleBack = () => {
    prevStep();
  };

  /**
   * Handles the "Next" button click.
   */
  const handleNext = () => {
    handleSubmit(onSubmit)(); // Now handleSubmit is defined
  };

  return (
    <form className="space-y-6">
      {/* Heading */}
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Step 1: Basic Information
      </h2>

      {/* First Row: Tour Title */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          Tour Title<span className="text-red-500">*</span>
        </label>
        <input
          {...register("basicInfo.tourTitle", {
            required: "Tour Title is required",
            minLength: {
              value: 10,
              message: "Tour Title must be at least 10 characters",
            },
            maxLength: {
              value: 60,
              message: "Tour Title must be at most 60 characters",
            },
          })}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.basicInfo?.tourTitle ? "border-red-500" : ""
          }`}
          placeholder="Enter Tour Title"
        />
        {errors.basicInfo?.tourTitle && (
          <p className="mt-1 text-red-500 text-sm">
            {errors.basicInfo.tourTitle.message}
          </p>
        )}
        {checkingTitle && (
          <p className="mt-1 text-blue-500 text-sm">
            Checking title uniqueness...
          </p>
        )}
      </div>

      {/* Display Slug */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          Slug<span className="text-red-500">*</span>
        </label>
        <input
          {...register("basicInfo.slug", {
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message:
                "Slug can only contain lowercase letters, numbers, and hyphens",
            },
          })}
          className={`w-full px-4 py-2 border rounded-lg ${
            errors.basicInfo?.slug ? "border-red-500" : ""
          }`}
          placeholder="Auto-generated slug"
          readOnly // Set to false if you want to allow manual edits
        />
        {errors.basicInfo?.slug && (
          <p className="mt-1 text-red-500 text-sm">
            {errors.basicInfo.slug.message}
          </p>
        )}
      </div>

      {/* Second Row: Description */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          Description<span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-300 rounded-lg overflow-hidden">
          <Controller
            name="basicInfo.description"
            control={control}
            rules={{
              required: "Description is required",
              minLength: {
                value: 50,
                message: "Description must be at least 50 characters",
              },
              maxLength: {
                value: 500,
                message: "Description must be at most 500 characters",
              },
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
        {errors.basicInfo?.description && (
          <p className="text-red-500 text-sm">
            {errors.basicInfo.description.message}
          </p>
        )}
      </div>

      {/* Adjusted UI Layout: Country, Group Type*, Main Focus*, Duration Value*, Duration Unit* */}
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0 mb-6">
        {/* Country */}
        <div className="flex-1">
          <label className="block mb-2 font-semibold text-gray-700">
            Country<span className="text-red-500">*</span>
          </label>
          <Controller
            name="basicInfo.country"
            control={control}
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={countries}
                placeholder={
                  loadingCountries ? "Loading countries..." : "Select Country"
                }
                isLoading={loadingCountries}
                isDisabled={loadingCountries || errorCountries}
              />
            )}
          />
          {errorCountries && (
            <p className="mt-1 text-red-500 text-sm">{errorCountries}</p>
          )}
          {errors.basicInfo?.country && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.basicInfo.country.message}
            </p>
          )}
        </div>

        {/* Group Type */}
        <div className="flex-1">
          <label className="block mb-2 font-semibold text-gray-700">
            Group Type<span className="text-red-500">*</span>
          </label>
          <select
            {...register("basicInfo.groupType", {
              required: "Group Type is required",
            })}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.basicInfo?.groupType ? "border-red-500" : ""
            }`}
          >
            <option value="">Select Group Type</option>
            <option value="Private">Private</option>
            <option value="Family">Family</option>
            <option value="Couple">Couple</option>
            <option value="Shared Group Tour">Shared Group Tour</option>
            <option value="Solo">Solo</option>
            <option value="Group">Group</option>
          </select>
          {errors.basicInfo?.groupType && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.basicInfo.groupType.message}
            </p>
          )}
        </div>

        {/* Main Focus */}
        <div className="flex-1">
          <label className="block mb-2 font-semibold text-gray-700">
            Main Focus<span className="text-red-500">*</span>
          </label>
          <Controller
            name="basicInfo.mainFocus"
            control={control}
            rules={{ required: "Main Focus is required" }}
            render={({ field }) => (
              <Select
                isMulti
                {...field}
                options={[
                  { value: "Game drive safari", label: "Game drive safari" },
                  { value: "Beach holiday", label: "Beach holiday" },
                  { value: "Mountain climbing", label: "Mountain climbing" },
                  {
                    value: "Cultural experience",
                    label: "Cultural experience",
                  },
                  { value: "Bird watching", label: "Bird watching" },
                  { value: "Photography", label: "Photography" },
                  { value: "Hiking", label: "Hiking" },
                  { value: "Wildlife", label: "Wildlife" },
                  { value: "Adventure", label: "Adventure" },
                  { value: "Family", label: "Family" },
                  // Add more options as needed
                ]}
                placeholder="Select Main Focus"
              />
            )}
          />
          {errors.basicInfo?.mainFocus && (
            <p className="text-red-500 text-sm">
              {errors.basicInfo.mainFocus.message}
            </p>
          )}
        </div>

        {/* Duration Value */}
        <div className="flex-1">
          <label className="block mb-2 font-semibold text-gray-700">
            Duration Value<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("basicInfo.durationValue", {
              required: "Duration Value is required",
              min: { value: 1, message: "Duration must be at least 1 day" },
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.basicInfo?.durationValue ? "border-red-500" : ""
            }`}
            placeholder="e.g., 5"
          />
          {errors.basicInfo?.durationValue && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.basicInfo.durationValue.message}
            </p>
          )}
        </div>

        {/* Duration Unit */}
        <div className="flex-1">
          <label className="block mb-2 font-semibold text-gray-700">
            Duration Unit<span className="text-red-500">*</span>
          </label>
          <select
            {...register("basicInfo.durationUnit", {
              required: "Duration Unit is required",
            })}
            className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.basicInfo?.durationUnit ? "border-red-500" : ""
            }`}
          >
            <option value="">Select duration unit</option>
            <option value="day">Day</option>
            <option value="days">Days</option>
            <option value="week">Week</option>
            <option value="weeks">Weeks</option>
          </select>
          {errors.basicInfo?.durationUnit && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.basicInfo.durationUnit.message}
            </p>
          )}
        </div>
      </div>

      {/* Fourth Row: Special Criteria (Left) & Tags (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Special Criteria */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Special Criteria
          </label>
          <div className="flex flex-wrap items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("basicInfo.isFeatured")}
                className="h-4 w-4"
              />
              <span>Featured</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("basicInfo.isOffer")}
                className="h-4 w-4"
              />
              <span>Offer</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("basicInfo.isRecommended")}
                className="h-4 w-4"
              />
              <span>Hiking</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("basicInfo.isSpecialPackage")}
                className="h-4 w-4"
              />
              <span>SP </span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("basicInfo.isDayTrip")}
                className="h-4 w-4"
              />
              <span>Day </span>
            </label>
            {/* Add more checkboxes as needed */}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Tags (Select at least 1)<span className="text-red-500">*</span>
          </label>
          <Controller
            name="basicInfo.tags"
            control={control}
            rules={{
              validate: (value) =>
                value && value.length > 0
                  ? true
                  : "At least one tag is required",
            }}
            render={({ field }) => (
              <Select
                isMulti
                {...field}
                options={tagsOptions}
                placeholder="Select Tags"
                classNamePrefix="react-select"
              />
            )}
          />
          {errors.basicInfo?.tags && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.basicInfo.tags.message}
            </p>
          )}
        </div>
      </div>

      {/* Fifth Row: Min People*, Max People, Type of Car Used*, Availability* */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Min People */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Min People<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("basicInfo.minPeople", {
              required: "Minimum People is required",
              min: { value: 1, message: "Minimum value is 1" },
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.basicInfo?.minPeople ? "border-red-500" : ""
            }`}
            placeholder="e.g., 1"
          />
          {errors.basicInfo?.minPeople && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.basicInfo.minPeople.message}
            </p>
          )}
        </div>

        {/* Max People */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Max People<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("basicInfo.maxPeople", {
              required: "Maximum People is required",
              min: { value: 1, message: "Minimum value is 1" },
              validate: (value) =>
                parseInt(value) >= parseInt(minPeople) ||
                "Max People should be greater than or equal to Min People",
            })}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.basicInfo?.maxPeople ? "border-red-500" : ""
            }`}
            placeholder="e.g., 10"
          />
          {errors.basicInfo?.maxPeople && (
            <p className="mt-1 text-red-500 text-sm">
              {errors.basicInfo.maxPeople.message}
            </p>
          )}
        </div>

        {/* Type of Car Used */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Type of Car Used<span className="text-red-500">*</span>
          </label>
          <Controller
            name="basicInfo.carTypes"
            control={control}
            rules={{ required: "Type of Car Used is required" }}
            render={({ field }) => (
              <Select
                isMulti
                {...field}
                options={[
                  {
                    value: "Open-sided 4x4 vehicle",
                    label: "Open-sided 4x4 vehicle",
                  },
                  {
                    value: "Closed-sided 4x4 vehicle",
                    label: "Closed-sided 4x4 vehicle",
                  },
                  { value: "Minibus", label: "Minibus" },
                  { value: "Bus", label: "Bus" },
                  { value: "Boat", label: "Boat" },
                  { value: "Walking", label: "Walking" },
                ]}
                placeholder="Select Car Types"
              />
            )}
          />
          {errors.basicInfo?.carTypes && (
            <p className="text-red-500 text-sm">
              {errors.basicInfo.carTypes.message}
            </p>
          )}
        </div>

        {/* Availability */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Availability<span className="text-red-500">*</span>
          </label>
          <Controller
            name="basicInfo.availability"
            control={control}
            rules={{ required: "Availability is required" }}
            render={({ field }) => (
              <Select
                isMulti
                {...field}
                options={[
                  { value: "January", label: "January" },
                  { value: "February", label: "February" },
                  { value: "March", label: "March" },
                  { value: "April", label: "April" },
                  { value: "May", label: "May" },
                  { value: "June", label: "June" },
                  { value: "July", label: "July" },
                  { value: "August", label: "August" },
                  { value: "September", label: "September" },
                  { value: "October", label: "October" },
                  { value: "November", label: "November" },
                  { value: "December", label: "December" },
                  { value: "Full Year", label: "Full Year" }, // Added Full Year option
                ]}
                placeholder="Select Availability Months"
              />
            )}
          />
          {errors.basicInfo?.availability && (
            <p className="text-red-500 text-sm">
              {errors.basicInfo.availability.message}
            </p>
          )}
        </div>
      </div>

      {/* Sixth Row: Getting There */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          Getting There
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              From<span className="text-red-500">*</span>
            </label>
            <Controller
              name="basicInfo.from"
              control={control}
              rules={{ required: "Starting point is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={destinations}
                  placeholder="Select starting point"
                  isLoading={loadingDestinations}
                  isDisabled={loadingDestinations || errorDestinations}
                />
              )}
            />
            {errorDestinations && (
              <p className="mt-1 text-red-500 text-sm">{errorDestinations}</p>
            )}
            {errors.basicInfo?.from && (
              <p className="text-red-500 text-sm">
                {errors.basicInfo.from.message}
              </p>
            )}

            {/* Display Coordinates Below Select Input */}
            {fromCoordinates ? (
              <p className="mt-2 text-gray-700">
                <strong>Coordinates:</strong> Lat {fromCoordinates.lat}, Lng{" "}
                {fromCoordinates.lng}
              </p>
            ) : selectedFrom ? (
              <p className="mt-2 text-gray-500">
                <em>Coordinates not available for the selected destination.</em>
              </p>
            ) : null}
          </div>

          {/* Ends */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Ends<span className="text-red-500">*</span>
            </label>
            <Controller
              name="basicInfo.ends"
              control={control}
              rules={{ required: "Ending point is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={destinations}
                  placeholder="Select ending point"
                  isLoading={loadingDestinations}
                  isDisabled={loadingDestinations || errorDestinations}
                />
              )}
            />
            {errorDestinations && (
              <p className="mt-1 text-red-500 text-sm">{errorDestinations}</p>
            )}
            {errors.basicInfo?.ends && (
              <p className="text-red-500 text-sm">
                {errors.basicInfo.ends.message}
              </p>
            )}

            {/* Display Coordinates Below Select Input */}
            {endsCoordinates ? (
              <p className="mt-2 text-gray-700">
                <strong>Coordinates:</strong> Lat {endsCoordinates.lat}, Lng{" "}
                {endsCoordinates.lng}
              </p>
            ) : selectedEnds ? (
              <p className="mt-2 text-gray-500">
                <em>Coordinates not available for the selected destination.</em>
              </p>
            ) : null}
          </div>
        </div>
      </div>

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
            !isValid ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isValid}
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default Step1BasicInfo;
