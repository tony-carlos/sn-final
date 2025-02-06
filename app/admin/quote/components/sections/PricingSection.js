// /app/admin/quote/components/sections/PricingSection.js

"use client";

import React, { useEffect } from "react";
import { useFormContext, Controller } from "react-hook-form";
import CreatableSelect from "react-select/creatable";

// Define Includes Options
const includesOptions = [
  { value: "All accommodation included in itinerary", label: "All accommodation included in itinerary" },
  { value: "Transfers to and from the mountain", label: "Transfers to and from the mountain" },
  { value: "National Park entry, camping, climbing and rescue fees", label: "National Park entry, camping, climbing and rescue fees" },
  { value: "A fully supported climb (average ratio of support staff to climber is 4:1 in open groups)", label: "A fully supported climb (average ratio of support staff to climber is 4:1 in open groups)" },
  { value: "All meals and drinking water on the mountain", label: "All meals and drinking water on the mountain" },
  { value: "A private portable toilet – no long drops for you!", label: "A private portable toilet – no long drops for you!" },
  { value: "High quality mess and sleeping tents with a comfortable foam mattress", label: "High quality mess and sleeping tents with a comfortable foam mattress" },
  { value: "Access to emergency oxygen and first aid kit", label: "Access to emergency oxygen and first aid kit" },
  { value: "A certificate documenting your summit ascent", label: "A certificate documenting your summit ascent" },
  { value: "Return airport transfers from/to Kilimanjaro International Airport (JRO)", label: "Return airport transfers from/to Kilimanjaro International Airport (JRO)" },
  { value: "Full board accommodation at safari lodges as per itinerary", label: "Full board accommodation at safari lodges as per itinerary" },
  { value: "Balloon safari in the Serengeti", label: "Balloon safari in the Serengeti" },
  { value: "Exclusive use of 4WD safari vehicle and English speaking driver guide", label: "Exclusive use of 4WD safari vehicle and English speaking driver guide" },
  { value: "All Park fees and Crater fees", label: "All Park fees and Crater fees" },
  { value: "Game drives as indicated in the itinerary", label: "Game drives as indicated in the itinerary" },
  { value: "Bottled mineral water while on game drives", label: "Bottled mineral water while on game drives" },
  { value: "4 nights accommodation in Zanzibar", label: "4 nights accommodation in Zanzibar" },
  { value: "Domestic flight one-way from JRO to ZNZ", label: "Domestic flight one-way from JRO to ZNZ" },
  { value: "Prices are based on 2 people sharing", label: "Prices are based on 2 people sharing" },
];

// Define Excludes Options
const excludesOptions = [
  { value: "International flights and visas", label: "International flights and visas" },
  { value: "Tips for your guides and crew", label: "Tips for your guides and crew" },
  { value: "Personal items", label: "Personal items" },
  { value: "Travel insurance (you must be insured, and specifically for treks up to 6000m)", label: "Travel insurance (you must be insured, and specifically for treks up to 6000m)" },
  { value: "Your personal trekking gear", label: "Your personal trekking gear" },
  { value: "Your personal medicines or prescriptions", label: "Your personal medicines or prescriptions" },
  { value: "Snacks on the mountain", label: "Snacks on the mountain" },
  { value: "Meals and drinks in Moshi, Arusha and Zanzibar", label: "Meals and drinks in Moshi, Arusha and Zanzibar" },
  { value: "Drinks of choice at safari lodges", label: "Drinks of choice at safari lodges" },
  { value: "Extra excursions / services available at safari lodges", label: "Extra excursions / services available at safari lodges" },
  { value: "Items of a personal nature, such as laundry, phone calls & snacks", label: "Items of a personal nature, such as laundry, phone calls & snacks" },
  { value: "Deviation from the safari itinerary provided", label: "Deviation from the safari itinerary provided" },
  { value: "Tips and gratuities for guide and lodge staff", label: "Tips and gratuities for guide and lodge staff" },
  { value: "Activities in Zanzibar", label: "Activities in Zanzibar" },
  { value: "Infrastructure tax Zanzibar", label: "Infrastructure tax Zanzibar" },
  { value: "Mandatory travel insurance in Zanzibar ($44 to be paid on arrival)", label: "Mandatory travel insurance in Zanzibar ($44 to be paid on arrival)" },
];

const PricingSection = () => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const adultPrice = parseFloat(watch("pricing.adultPrice")) || 0;
  const childPrice = parseFloat(watch("pricing.childPrice")) || 0;
  const numberOfAdults = parseInt(watch("pricing.numberOfAdults")) || 1; // Default to 1
  const numberOfChildren = parseInt(watch("pricing.numberOfChildren")) || 0;

  // Watch includes and excludes
  const includes = watch("pricing.include") || [];
  const excludes = watch("pricing.exclude") || [];

  // Calculate total cost
  const totalCost = adultPrice * numberOfAdults + childPrice * numberOfChildren;

  useEffect(() => {
    setValue("pricing.total", totalCost);
  }, [adultPrice, childPrice, numberOfAdults, numberOfChildren, totalCost, setValue]);

  return (
    <div className="mb-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Pricing</h2>

      {/* Grouped Inputs: Number of Adults*, Price per Adult*, Number of Children, Price per Child */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Number of Adults */}
        <div>
          <label className="block mb-1 font-semibold">
            Number of Adults<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("pricing.numberOfAdults", {
              required: "Number of adults is required",
              min: { value: 1, message: "At least 1 adult is required" },
            })}
            className="w-full p-2 border rounded"
            min="1"
            defaultValue={1}
          />
          {errors.pricing?.numberOfAdults && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pricing.numberOfAdults.message}
            </p>
          )}
        </div>

        {/* Price per Adult */}
        <div>
          <label className="block mb-1 font-semibold">
            Price per Adult<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("pricing.adultPrice", {
              required: "Price per adult is required",
              min: { value: 0, message: "Price cannot be negative" },
            })}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
          {errors.pricing?.adultPrice && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pricing.adultPrice.message}
            </p>
          )}
        </div>

        {/* Number of Children */}
        <div>
          <label className="block mb-1 font-semibold">
            Number of Children
          </label>
          <input
            type="number"
            {...register("pricing.numberOfChildren", {
              min: { value: 0, message: "Number of children cannot be negative" },
            })}
            className="w-full p-2 border rounded"
            min="0"
            defaultValue={0}
          />
          {errors.pricing?.numberOfChildren && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pricing.numberOfChildren.message}
            </p>
          )}
        </div>

        {/* Price per Child */}
        <div>
          <label className="block mb-1 font-semibold">
            Price per Child
          </label>
          <input
            type="number"
            {...register("pricing.childPrice", {
              min: { value: 0, message: "Price cannot be negative" },
            })}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
          />
          {errors.pricing?.childPrice && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pricing.childPrice.message}
            </p>
          )}
        </div>
      </div>

      {/* Includes Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Includes</h3>
        <Controller
          name="pricing.include"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              isMulti
              options={includesOptions}
              placeholder="Select or create includes"
              classNamePrefix="react-select"
              onChange={(value) => field.onChange(value)}
              value={field.value}
            />
          )}
        />
        {errors.pricing?.include && (
          <p className="text-red-500 text-sm mt-1">
            {errors.pricing.include.message}
          </p>
        )}
      </div>

      {/* Excludes Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Excludes</h3>
        <Controller
          name="pricing.exclude"
          control={control}
          render={({ field }) => (
            <CreatableSelect
              {...field}
              isMulti
              options={excludesOptions}
              placeholder="Select or create excludes"
              classNamePrefix="react-select"
              onChange={(value) => field.onChange(value)}
              value={field.value}
            />
          )}
        />
        {errors.pricing?.exclude && (
          <p className="text-red-500 text-sm mt-1">
            {errors.pricing.exclude.message}
          </p>
        )}
      </div>

      {/* Total Cost */}
      <div>
        <label className="block mb-1 font-semibold">Total Cost</label>
        <input
          type="number"
          {...register("pricing.total")}
          value={totalCost}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
    </div>
  );
};

export default PricingSection;
