// /app/admin/quote/components/sections/ClientInfoSection.js

"use client";

import React, { useEffect } from "react";
import { useFormContext } from "react-hook-form";

const ClientInfoSection = () => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const startingDay = watch("clientInfo.startingDay");
  const endingDay = watch("clientInfo.endingDay");
  const startingDayName = watch("clientInfo.startingDayName");
  const endingDayName = watch("clientInfo.endingDayName");

  // Function to get the day name from a date string
  const getDayName = (dateString) => {
    if (!dateString) return "";
    const options = { weekday: "long" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  // Calculate total number of days and set day names whenever startingDay or endingDay changes
  useEffect(() => {
    // Set Starting Day Name
    if (startingDay) {
      const startDayName = getDayName(startingDay);
      setValue("clientInfo.startingDayName", startDayName);
    } else {
      setValue("clientInfo.startingDayName", "");
    }

    // Set Ending Day Name
    if (endingDay) {
      const endDayName = getDayName(endingDay);
      setValue("clientInfo.endingDayName", endDayName);
    } else {
      setValue("clientInfo.endingDayName", "");
    }

    // Calculate Total Days
    if (startingDay && endingDay) {
      const start = new Date(startingDay);
      const end = new Date(endingDay);
      const diffTime = end - start;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive of both start and end days
      setValue("totalDays", diffDays > 0 ? diffDays : 0);
    } else {
      setValue("totalDays", 0);
    }
  }, [startingDay, endingDay, setValue]);

  // Watch totalDays from form state
  const totalDays = watch("totalDays");

  return (
    <div className="mb-6 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Client Information</h2>

      {/* First Row: Client Name*, Email, Phone Number */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Client Name */}
        <div>
          <label className="block mb-1 font-semibold">
            Client Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            {...register("clientInfo.clientName", {
              required: "Client Name is required",
              minLength: {
                value: 3,
                message: "Client Name must be at least 3 characters",
              },
            })}
            className="w-full p-2 border rounded"
            placeholder="Enter Client Name"
          />
          {errors.clientInfo?.clientName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.clientInfo.clientName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            {...register("clientInfo.email", {
              pattern: {
                value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                message: "Invalid email address",
              },
            })}
            className="w-full p-2 border rounded"
            placeholder="Enter Email"
          />
          {errors.clientInfo?.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.clientInfo.email.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            type="tel"
            {...register("clientInfo.phoneNumber", {
              pattern: {
                value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/,
                message: "Invalid phone number",
              },
            })}
            className="w-full p-2 border rounded"
            placeholder="Enter Phone Number"
          />
          {errors.clientInfo?.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.clientInfo.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      {/* Second Row: Starting Day*, Ending Day*, Total Number of Days */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Starting Day */}
        <div>
          <label className="block mb-1 font-semibold">
            Starting Day<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("clientInfo.startingDay", {
              required: "Starting Day is required",
            })}
            className="w-full p-2 border rounded"
          />
          {errors.clientInfo?.startingDay && (
            <p className="text-red-500 text-sm mt-1">
              {errors.clientInfo.startingDay.message}
            </p>
          )}
          {/* Display Starting Day Name */}
          {startingDay && startingDayName && (
            <p className="text-gray-600 text-sm mt-1">Day: {startingDayName}</p>
          )}
        </div>

        {/* Ending Day */}
        <div>
          <label className="block mb-1 font-semibold">
            Ending Day<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("clientInfo.endingDay", {
              required: "Ending Day is required",
              validate: {
                afterStart: (value) => {
                  if (!startingDay) {
                    return "Please select Starting Day first";
                  }
                  const start = new Date(startingDay);
                  const end = new Date(value);
                  return (
                    end >= start || "Ending Day must be after Starting Day"
                  );
                },
              },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.clientInfo?.endingDay && (
            <p className="text-red-500 text-sm mt-1">
              {errors.clientInfo.endingDay.message}
            </p>
          )}
          {/* Display Ending Day Name */}
          {endingDay && endingDayName && (
            <p className="text-gray-600 text-sm mt-1">Day: {endingDayName}</p>
          )}
        </div>

        {/* Total Number of Days */}
        <div>
          <label className="block mb-1 font-semibold">
            Total Number of Days:
          </label>
          <input
            type="number"
            value={totalDays}
            readOnly
            className="w-full p-2 border rounded bg-green-100 text-green-800 font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default ClientInfoSection;
