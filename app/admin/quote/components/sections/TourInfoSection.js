"use client";

import React, { useRef, useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const libraries = ["places"];

const TourInfoSection = ({ tourData = null }) => {
  const {
    register,
    control,
    setValue,
    reset,
  } = useFormContext();

  // Refs to store Autocomplete instances
  const autocompleteRefStart = useRef(null);
  const autocompleteRefEnd = useRef(null);

  // When tourData changes (in case of editing), prepopulate form values
  useEffect(() => {
    if (tourData) {
      reset({
        tourInfo: {
          ...tourData,
        },
      });
      if (tourData.startingFromCoordinates) {
        setValue("tourInfo.startingFromCoordinates", tourData.startingFromCoordinates);
      }
      if (tourData.endingFromCoordinates) {
        setValue("tourInfo.endingFromCoordinates", tourData.endingFromCoordinates);
      }
    }
  }, [tourData, reset, setValue]);

  const handlePlaceChangedStart = () => {
    if (autocompleteRefStart.current !== null) {
      const place = autocompleteRefStart.current.getPlace();
      if (place.formatted_address) {
        setValue("tourInfo.startingFrom", place.formatted_address);
      } else if (place.name) {
        setValue("tourInfo.startingFrom", place.name);
      }

      // Capture and store the coordinates
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      setValue("tourInfo.startingFromCoordinates", { lat, lng });
    }
  };

  const handlePlaceChangedEnd = () => {
    if (autocompleteRefEnd.current !== null) {
      const place = autocompleteRefEnd.current.getPlace();
      if (place.formatted_address) {
        setValue("tourInfo.endingFrom", place.formatted_address);
      } else if (place.name) {
        setValue("tourInfo.endingFrom", place.name);
      }

      // Capture and store the coordinates
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      setValue("tourInfo.endingFromCoordinates", { lat, lng });
    }
  };

  return (
    <div className="mb-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Tour Information</h2>

      {/* Tour Title and Type of Tour */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
        {/* Tour Title */}
        <div className="md:col-span-8">
          <label className="block mb-1 font-semibold">
            Tour Title<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("tourInfo.tourTitle", {
              required: "Tour Title is required",
              minLength: {
                value: 5,
                message: "Tour Title must be at least 5 characters",
              },
            })}
            className="w-full p-2 border rounded"
            placeholder="Enter Tour Title"
          />
        </div>

        {/* Type of Tour */}
        <div className="md:col-span-4">
          <label className="block mb-1 font-semibold">
            Type of Tour<span className="text-red-500">*</span>
          </label>
          <select
            {...register("tourInfo.typeOfTour", {
              required: "Type of Tour is required",
            })}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Type of Tour</option>
            <option value="private">Private</option>
            <option value="group">Group</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
          </select>
        </div>
      </div>

      {/* Description with CKEditor */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">
          Description<span className="text-red-500">*</span>
        </label>
        <Controller
          name="tourInfo.description"
          control={control}
          rules={{
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
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
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                  "blockQuote",
                  "|",
                  "undo",
                  "redo",
                ],
              }}
            />
          )}
        />
      </div>

      {/* Starting From and Ending From with Google Places Autocomplete */}
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Starting From */}
          <div>
            <label className="block mb-1 font-semibold">
              Starting From<span className="text-red-500">*</span>
            </label>
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRefStart.current = autocomplete)}
              onPlaceChanged={handlePlaceChangedStart}
            >
              <input
                type="text"
                placeholder="Search for a starting location"
                className="w-full p-2 border rounded"
                defaultValue={tourData?.startingFrom || ""}
              />
            </Autocomplete>
          </div>

          {/* Ending From */}
          <div>
            <label className="block mb-1 font-semibold">
              Ending From<span className="text-red-500">*</span>
            </label>
            <Autocomplete
              onLoad={(autocomplete) => (autocompleteRefEnd.current = autocomplete)}
              onPlaceChanged={handlePlaceChangedEnd}
            >
              <input
                type="text"
                placeholder="Search for an ending location"
                className="w-full p-2 border rounded"
                defaultValue={tourData?.endingFrom || ""}
              />
            </Autocomplete>
          </div>
        </div>
      </LoadScript>
    </div>
  );
};

export default TourInfoSection;
