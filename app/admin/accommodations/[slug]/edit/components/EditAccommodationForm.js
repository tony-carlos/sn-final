"use client";

import React, { useEffect, useState, useCallback } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import ImageCropper from "@/app/components/ImageCropper"; // Ensure this component exists
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/app/lib/firebase"; // Ensure Firebase is correctly initialized
import { doc, getDoc, updateDoc, setDoc, deleteDoc } from "firebase/firestore";

// Utility function to capitalize words
const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

// Helper function to slugify strings
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -

const EditAccommodationForm = ({ initialData, onSuccess }) => {
  // State variables initialized with initialData
  const [destinations, setDestinations] = useState([]);
  const [destinationsLoading, setDestinationsLoading] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(
    initialData.destinationId
  );

  const [availableAccommodations, setAvailableAccommodations] = useState([]);
  const [accommodationsLoading, setAccommodationsLoading] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(
    initialData.accommodation || null
  );

  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [website, setWebsite] = useState(initialData.website || "");
  const [phone, setPhone] = useState(initialData.phoneNumber || "");
  const [levelCategory, setLevelCategory] = useState(
    initialData.levelCategory || ""
  );
  const [amenities, setAmenities] = useState(initialData.amenities || []);
  const [zone, setZone] = useState(initialData.zone || null);
  const [isInPark, setIsInPark] = useState(initialData.isInPark || false);
  const [concessionFeeCategory, setConcessionFeeCategory] = useState(
    initialData.concessionFeeCategory || ""
  );
  const [concessionFees, setConcessionFees] = useState(
    initialData.concessionFees || []
  );
  const [pricing, setPricing] = useState(
    initialData.pricing || {
      high_season: { categories: [] },
      low_season: { categories: [] },
    }
  );
  const [images, setImages] = useState(initialData.images || []); // Array of { url, storagePath }
  const [seoTitle, setSeoTitle] = useState(initialData.seo?.title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData.seo?.description || ""
  );
  const [facilities, setFacilities] = useState(initialData.facilities || []);

  // Image Cropper state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState(null); // For cropping

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Name uniqueness
  const [isNameUnique, setIsNameUnique] = useState(true);
  const [checkingName, setCheckingName] = useState(false);

  // Fetch Destinations on Mount
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setDestinationsLoading(true);
    try {
      const response = await axios.get("/api/destinations");
      if (response.status === 200) {
        const formattedDestinations = response.data.destinations.map(
          (dest) => ({
            value: dest.id,
            label: dest.title,
            coordinates: dest.coordinates, // { lat, lng }
          })
        );
        setDestinations(formattedDestinations);
      } else {
        toast.error("Failed to fetch destinations.");
      }
    } catch (error) {
      console.error(
        "Error fetching destinations:",
        error.response ? error.response.data : error.message
      );
      toast.error("An error occurred while fetching destinations.");
    } finally {
      setDestinationsLoading(false);
    }
  };

  // Fetch Accommodations when Destination Changes
  const fetchAccommodations = useCallback(async (destinationId) => {
    setAccommodationsLoading(true);
    try {
      const response = await axios.get("/api/accommodations", {
        params: { action: "nearby", destinationId },
      });

      if (response.status === 200) {
        const formattedAccommodations = response.data.accommodations.map(
          (acc) => ({
            value: acc.placeId,
            label: acc.name,
            placeId: acc.placeId,
            address: acc.address,
            location: acc.location,
            types: acc.types,
            rating: acc.rating,
            userRatingsTotal: acc.userRatingsTotal,
            website: acc.website,
            phoneNumber: acc.phoneNumber,
            category: acc.category,
          })
        );
        setAvailableAccommodations(formattedAccommodations);
      } else {
        toast.error("Failed to fetch accommodations.");
      }
    } catch (error) {
      console.error(
        "Error fetching accommodations:",
        error.response ? error.response.data : error.message
      );
      toast.error("An error occurred while fetching accommodations.");
    } finally {
      setAccommodationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedDestination) {
      fetchAccommodations(selectedDestination);
    } else {
      setAvailableAccommodations([]);
      setSelectedAccommodation(null);
      setName(""); // Reset name if no destination
      setImages([]); // Optionally reset images
    }
  }, [selectedDestination, fetchAccommodations]);

  // Handle Destination Change
  const handleDestinationChange = (selectedOption) => {
    setSelectedDestination(selectedOption ? selectedOption.value : null);
    setSelectedAccommodation(null);
    setName(""); // Reset name when destination changes
    setImages([]); // Optionally reset images
  };

  // Handle Accommodation Change
  const handleAccommodationChange = (selectedOption) => {
    if (selectedOption && selectedOption.placeId) {
      setSelectedAccommodation(selectedOption);
      setName(selectedOption.label);
      // Optionally fetch and set other details if necessary
    } else {
      // If creating manually, allow name input
      setSelectedAccommodation(null);
      setName("");
    }
  };

  // Handle Creating a New Accommodation
  const handleCreateAccommodation = (inputValue) => {
    const newOption = {
      value: uuidv4(),
      label: inputValue,
      placeId: null,
      address: "",
      location: { lat: 0, lng: 0 },
      types: [],
      rating: null,
      userRatingsTotal: null,
      website: "",
      phoneNumber: "",
      category: "custom",
    };
    setAvailableAccommodations([...availableAccommodations, newOption]);
    setSelectedAccommodation(newOption);
    setName(inputValue);
  };

  // Check Name Uniqueness with Debounce
  useEffect(() => {
    if (!name) {
      setIsNameUnique(true);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      checkNameUniqueness(name);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [name]);

  const checkNameUniqueness = useCallback(
    async (nameToCheck) => {
      setCheckingName(true);
      try {
        const slug = slugify(nameToCheck);
        if (slug === initialData.slug) {
          setIsNameUnique(true);
          setCheckingName(false);
          return;
        }

        const response = await axios.get("/api/accommodations", {
          params: { action: "checkSlug", slug },
        });
        if (response.data.exists) {
          setIsNameUnique(false);
        } else {
          setIsNameUnique(true);
        }
      } catch (error) {
        console.error(
          "Error checking name uniqueness:",
          error.response ? error.response.data : error.message
        );
        // Assume name is unique in case of error to not block user
        setIsNameUnique(true);
      } finally {
        setCheckingName(false);
      }
    },
    [initialData.slug]
  );

  // Handle Image Selection and Cropping
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentImageFile(file);
      setCropModalOpen(true);
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    try {
      const storagePath = `accommodations/${uuidv4()}-${croppedBlob.name}`;
      const imageRef = ref(storage, storagePath);
      await uploadBytes(imageRef, croppedBlob);
      const downloadURL = await getDownloadURL(imageRef);

      setImages([...images, { url: downloadURL, storagePath }]);
      setCropModalOpen(false);
      setCurrentImageFile(null);
      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error(
        "Error uploading image:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to upload image.");
      setCropModalOpen(false);
      setCurrentImageFile(null);
    }
  };

  const handleCancelCrop = () => {
    setCropModalOpen(false);
    setCurrentImageFile(null);
  };

  // Handle Removing an Image
  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];
    if (!imageToRemove) return;

    try {
      const imageRef = ref(storage, imageToRemove.storagePath);
      await deleteObject(imageRef);

      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);

      toast.success("Image removed successfully.");
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.error("Image not found in storage:", error);
        toast.error("Image not found in storage.");
        // Optionally remove the image from the state if it's not in storage
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
      } else {
        console.error(
          "Error removing image:",
          error.response ? error.response.data : error.message
        );
        toast.error("Failed to remove image.");
      }
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !selectedDestination || images.length < 4) {
      toast.error(
        "Please fill in all required fields, select a destination, and upload at least four images."
      );
      return;
    }

    if (!isNameUnique || checkingName) {
      toast.error("Please resolve the errors before submitting.");
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const payload = {
        name,
        slug: slugify(name),
        destinationId: selectedDestination,
        accommodation:
          selectedAccommodation && selectedAccommodation.placeId
            ? {
                value: selectedAccommodation.value,
                label: selectedAccommodation.label,
                placeId: selectedAccommodation.placeId,
                address: selectedAccommodation.address,
                location: selectedAccommodation.location,
                types: selectedAccommodation.types,
                rating: selectedAccommodation.rating,
                userRatingsTotal: selectedAccommodation.userRatingsTotal,
                website: selectedAccommodation.website,
                phoneNumber: selectedAccommodation.phoneNumber,
                category: selectedAccommodation.category,
              }
            : {
                value: selectedAccommodation.value,
                label: selectedAccommodation.label,
                placeId: null,
                address: selectedAccommodation.address,
                location: selectedAccommodation.location,
                types: selectedAccommodation.types,
                rating: selectedAccommodation.rating,
                userRatingsTotal: selectedAccommodation.userRatingsTotal,
                website: selectedAccommodation.website,
                phoneNumber: selectedAccommodation.phoneNumber,
                category: selectedAccommodation.category,
              },
        description,
        website,
        phoneNumber: phone,
        levelCategory,
        amenities,
        zone,
        isInPark,
        concessionFeeCategory: isInPark ? concessionFeeCategory : null,
        concessionFees: isInPark ? concessionFees : [],
        pricing,
        images,
        seo: { title: seoTitle, description: seoDescription },
        facilities,
        updatedAt: new Date().toISOString(),
      };

      // Send update request
      const response = await axios.put(
        `/api/accommodations/${initialData.slug}`,
        payload
      );

      if (response.status === 200) {
        toast.success("Accommodation updated successfully!");
        if (onSuccess) onSuccess();
      } else {
        toast.error("Failed to update accommodation.");
      }
    } catch (error) {
      console.error(
        "Error updating accommodation:",
        error.response ? error.response.data : error.message
      );
      toast.error("An error occurred while updating accommodation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Destination Selection */}
      <div>
        <label className="block mb-2 font-semibold">
          Destination<span className="text-red-500">*</span>
        </label>
        {destinationsLoading ? (
          <div className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 text-gray-600 mr-2"
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
            <span>Loading destinations...</span>
          </div>
        ) : (
          <Select
            options={destinations}
            value={
              destinations.find((dest) => dest.value === selectedDestination) ||
              null
            }
            onChange={handleDestinationChange}
            placeholder="Select Destination"
            isClearable
            required
          />
        )}
      </div>

      {/* Accommodation Selection or Creation */}
      <div>
        <label className="block mb-2 font-semibold">
          Accommodation Name<span className="text-red-500">*</span>
        </label>
        <CreatableSelect
          options={availableAccommodations}
          value={selectedAccommodation}
          onChange={handleAccommodationChange}
          onCreateOption={handleCreateAccommodation}
          placeholder="Select or Type Accommodation"
          isClearable
          isSearchable
          formatOptionLabel={(option) => (
            <div>
              <span>{option.label}</span>
              {option.category && (
                <span className="ml-2 text-sm text-gray-500">
                  ({capitalizeWords(option.category.replace(/_/g, " "))})
                </span>
              )}
            </div>
          )}
        />
        {checkingName && (
          <p className="text-sm text-gray-500">Checking name...</p>
        )}
        {!isNameUnique && (
          <p className="text-sm text-red-500">This name is already taken.</p>
        )}
      </div>

      {/* Name Input (Visible only if manually creating) */}
      {!selectedAccommodation?.placeId && (
        <div>
          <label className="block mb-2 font-semibold">
            Accommodation Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`p-2 border rounded w-full ${
              !isNameUnique ? "border-red-500" : ""
            }`}
            placeholder="Enter Accommodation Name"
            required
          />
        </div>
      )}

      {/* Description */}
      <div>
        <label className="block mb-2 font-semibold">
          Description<span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed description..."
          className="p-2 border rounded w-full"
          rows={4}
          required
        ></textarea>
      </div>

      {/* Website */}
      <div>
        <label className="block mb-2 font-semibold">Website</label>
        <input
          type="url"
          placeholder="https://example.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="block mb-2 font-semibold">Phone Number</label>
        <input
          type="tel"
          placeholder="+1234567890"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Level Category */}
      <div>
        <label className="block mb-2 font-semibold">Level Category</label>
        <input
          type="text"
          placeholder="e.g., 5-Star"
          value={levelCategory}
          onChange={(e) => setLevelCategory(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Amenities */}
      <div>
        <label className="block mb-2 font-semibold">Amenities</label>
        <Select
          isMulti
          options={[
            { value: "wifi", label: "Wi-Fi" },
            { value: "pool", label: "Swimming Pool" },
            { value: "spa", label: "Spa" },
            { value: "gym", label: "Gym" },
            { value: "restaurant", label: "Restaurant" },
            { value: "bar", label: "Bar" },
            { value: "parking", label: "Parking" },
            // Add more amenities as needed
          ]}
          value={amenities.map((amenity) => ({
            value: amenity,
            label: capitalizeWords(amenity.replace(/_/g, " ")),
          }))}
          onChange={(selectedOptions) => {
            setAmenities(
              selectedOptions ? selectedOptions.map((opt) => opt.value) : []
            );
          }}
          placeholder="Select Amenities"
          isClearable
        />
      </div>

      {/* Zone */}
      <div>
        <label className="block mb-2 font-semibold">Zone</label>
        <Select
          options={[
            { value: "beachside", label: "Beachside" },
            { value: "city_center", label: "City Center" },
            { value: "forest_edge", label: "Forest Edge" },
            { value: "mountain_view", label: "Mountain View" },
            // Add more zones as needed
          ]}
          value={
            zone
              ? {
                  value: zone,
                  label: capitalizeWords(zone.replace(/_/g, " ")),
                }
              : null
          }
          onChange={(selectedOption) => {
            setZone(selectedOption ? selectedOption.value : null);
          }}
          placeholder="Select Zone"
          isClearable
        />
      </div>

      {/* Is in Park */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isInPark"
          checked={isInPark}
          onChange={() => setIsInPark(!isInPark)}
          className="h-4 w-4"
        />
        <label htmlFor="isInPark" className="select-none">
          Is in Park?
        </label>
      </div>

      {/* Concession Fee Category (Visible only if "Is in Park?" is checked) */}
      {isInPark && (
        <div>
          <label className="block mb-2 font-semibold">
            Concession Fee Category
          </label>
          <Select
            options={[
              { value: "hotel", label: "Hotel" },
              { value: "permanent_camping", label: "Permanent Camping" },
              { value: "public_camping", label: "Public Camping" },
              { value: "seasonal_camping", label: "Seasonal Camping" },
              { value: "special_campsite", label: "Special Campsite" },
              { value: "migration_campsite", label: "Migration Campsite" },
            ]}
            value={
              concessionFeeCategory
                ? {
                    value: concessionFeeCategory,
                    label: capitalizeWords(
                      concessionFeeCategory.replace(/_/g, " ")
                    ),
                  }
                : null
            }
            onChange={(selectedOption) => {
              setConcessionFeeCategory(
                selectedOption ? selectedOption.value : ""
              );
              // Optionally set default concession fees based on category
            }}
            placeholder="Select Concession Fee Category"
            isClearable
          />
        </div>
      )}

      {/* Concession Fees Form (Visible only if "Is in Park?" is checked) */}
      {isInPark && concessionFees.length > 0 && (
        <div className="border p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Concession Fees</h3>
          {concessionFees.map((fee, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-1 font-medium">Category:</label>
              <input
                type="text"
                placeholder="Category (e.g., Hotel)"
                value={fee.category}
                onChange={(e) =>
                  setConcessionFees((prev) => {
                    const updatedFees = [...prev];
                    updatedFees[index].category = e.target.value;
                    return updatedFees;
                  })
                }
                className="p-2 border rounded w-full mb-2"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Non Resident Fee</label>
                  <input
                    type="number"
                    placeholder="Non Resident Fee"
                    value={fee.fees.nonResident}
                    onChange={(e) =>
                      setConcessionFees((prev) => {
                        const updatedFees = [...prev];
                        updatedFees[index].fees.nonResident = e.target.value;
                        return updatedFees;
                      })
                    }
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Resident Fee</label>
                  <input
                    type="number"
                    placeholder="Resident Fee"
                    value={fee.fees.resident}
                    onChange={(e) =>
                      setConcessionFees((prev) => {
                        const updatedFees = [...prev];
                        updatedFees[index].fees.resident = e.target.value;
                        return updatedFees;
                      })
                    }
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Crew Fee</label>
                  <input
                    type="number"
                    placeholder="Crew Fee"
                    value={fee.fees.crew}
                    onChange={(e) =>
                      setConcessionFees((prev) => {
                        const updatedFees = [...prev];
                        updatedFees[index].fees.crew = e.target.value;
                        return updatedFees;
                      })
                    }
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    Children 5-15 Non Resident Fee
                  </label>
                  <input
                    type="number"
                    placeholder="Children 5-15 Non Resident Fee"
                    value={fee.fees.childrenNonResident}
                    onChange={(e) =>
                      setConcessionFees((prev) => {
                        const updatedFees = [...prev];
                        updatedFees[index].fees.childrenNonResident =
                          e.target.value;
                        return updatedFees;
                      })
                    }
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    Children 5-15 Resident Fee
                  </label>
                  <input
                    type="number"
                    placeholder="Children 5-15 Resident Fee"
                    value={fee.fees.childrenResident}
                    onChange={(e) =>
                      setConcessionFees((prev) => {
                        const updatedFees = [...prev];
                        updatedFees[index].fees.childrenResident =
                          e.target.value;
                        return updatedFees;
                      })
                    }
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">
                    Expatriate/TZ Resident Fee
                  </label>
                  <input
                    type="number"
                    placeholder="Expatriate/TZ Resident Fee"
                    value={fee.fees.expatriate}
                    onChange={(e) =>
                      setConcessionFees((prev) => {
                        const updatedFees = [...prev];
                        updatedFees[index].fees.expatriate = e.target.value;
                        return updatedFees;
                      })
                    }
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setConcessionFees((prev) =>
                    prev.filter((_, i) => i !== index)
                  );
                }}
                className="text-red-500 mt-2 flex items-center hover:underline"
              >
                <FaTrash /> Remove Concession Fee
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setConcessionFees((prev) => [
                ...prev,
                {
                  category: "",
                  fees: {
                    nonResident: "",
                    resident: "",
                    crew: "",
                    childrenNonResident: "",
                    childrenResident: "",
                    expatriate: "",
                  },
                },
              ]);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            + Add Concession Fee
          </button>
        </div>
      )}

      {/* Image Upload and Thumbnails */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Accommodation Images</h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="mb-4"
        />
        {images.length > 0 && (
          <div className="flex flex-wrap">
            {images.map((img, index) => (
              <div
                key={img.storagePath || `uploaded-${index}`}
                className="relative m-2"
              >
                <Image
                  src={img.url}
                  alt={`Accommodation Image ${index + 1}`}
                  width={150}
                  height={150}
                  className="object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-500 absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-red-100 transition-colors"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO Settings */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">SEO Settings</h3>
        <button
          type="button"
          onClick={() => {
            const destination =
              destinations.find((dest) => dest.value === selectedDestination)
                ?.label || "";
            const seoTitleGenerated = `Stay at ${name} in ${destination}`;
            const seoDescriptionGenerated = `Experience the best stay at ${name} located in ${destination}. Enjoy top-notch amenities and exceptional service. Book now!`;
            setSeoTitle(seoTitleGenerated);
            setSeoDescription(seoDescriptionGenerated);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
        >
          Generate SEO Title and Description
        </button>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">SEO Title</label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="SEO Title"
            className="p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">SEO Description</label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="SEO Description"
            className="p-2 border rounded w-full"
            rows={4}
          ></textarea>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={!isNameUnique || checkingName || isSubmitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors ${
            (!isNameUnique || checkingName || isSubmitting) &&
            "opacity-50 cursor-not-allowed"
          } w-full`}
        >
          {!isNameUnique || checkingName || isSubmitting
            ? "Fix Errors to Update"
            : "Update Accommodation"}
        </button>
      </div>

      {/* Image Cropper Modal */}
      {cropModalOpen && (
        <ImageCropper
          imgFile={currentImageFile}
          aspectRatio={1} // 1:1 aspect ratio for square images
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}
    </form>
  );
};

// PropTypes Validation
EditAccommodationForm.propTypes = {
  initialData: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    destinationId: PropTypes.string.isRequired,
    accommodation: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      placeId: PropTypes.string,
      address: PropTypes.string,
      location: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
      }),
      types: PropTypes.arrayOf(PropTypes.string),
      rating: PropTypes.number,
      userRatingsTotal: PropTypes.number,
      website: PropTypes.string,
      phoneNumber: PropTypes.string,
      category: PropTypes.string,
    }),
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
        storagePath: PropTypes.string.isRequired,
      })
    ),
    description: PropTypes.string,
    website: PropTypes.string,
    phoneNumber: PropTypes.string,
    levelCategory: PropTypes.string,
    amenities: PropTypes.arrayOf(PropTypes.string),
    zone: PropTypes.string,
    isInPark: PropTypes.bool,
    concessionFeeCategory: PropTypes.string,
    concessionFees: PropTypes.arrayOf(
      PropTypes.shape({
        category: PropTypes.string.isRequired,
        fees: PropTypes.shape({
          nonResident: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
          resident: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          crew: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          childrenNonResident: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
          childrenResident: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
          ]),
          expatriate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        }).isRequired,
      })
    ),
    pricing: PropTypes.shape({
      high_season: PropTypes.shape({
        categories: PropTypes.arrayOf(
          PropTypes.shape({
            chargeCategory: PropTypes.string,
            roomType: PropTypes.string,
            racketPrice: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number,
            ]),
            stoPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          })
        ),
      }),
      low_season: PropTypes.shape({
        categories: PropTypes.arrayOf(
          PropTypes.shape({
            chargeCategory: PropTypes.string,
            roomType: PropTypes.string,
            racketPrice: PropTypes.oneOfType([
              PropTypes.string,
              PropTypes.number,
            ]),
            stoPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
          })
        ),
      }),
    }),
    seo: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
    }),
    facilities: PropTypes.arrayOf(PropTypes.string),
    // Add other necessary fields here
  }).isRequired,
  onSuccess: PropTypes.func,
};

EditAccommodationForm.defaultProps = {
  onSuccess: null,
};

export default EditAccommodationForm;
