"use client";

import React, { useState, useEffect, useCallback } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { db, storage } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImageCropper from "@/app/components/ImageCropper";
import PropTypes from "prop-types";
import { slugify } from "@/app/lib/helpers";
import axios from "axios";

const AccommodationForm = ({ initialData, onSuccess, isEditMode }) => {
  // Form State
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(
    initialData?.destinationId || null
  );
  const [availableAccommodations, setAvailableAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(
    initialData?.slug
      ? {
          value: initialData.slug,
          label: initialData.name,
          placeId: initialData.placeId || "",
          address: initialData.address || "",
          location: initialData.location || { lat: 0, lng: 0 },
          types: initialData.types || [],
          rating: initialData.rating || null,
          userRatingsTotal: initialData.userRatingsTotal || null,
          website: initialData.website || "",
          phoneNumber: initialData.phoneNumber || "",
          category: initialData.category || "",
        }
      : null
  );

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [website, setWebsite] = useState(initialData?.website || "");
  const [phone, setPhone] = useState(initialData?.phoneNumber || "");
  const [levelCategory, setLevelCategory] = useState(
    initialData?.levelCategory || ""
  );
  const [amenities, setAmenities] = useState(
    initialData?.amenities
      ? initialData.amenities.map((amenity) => ({
          value: amenity,
          label: capitalizeWords(amenity.replace(/_/g, " ")),
        }))
      : []
  );
  const [zone, setZone] = useState(
    initialData?.zone
      ? {
          value: initialData.zone,
          label: capitalizeWords(initialData.zone.replace(/_/g, " ")),
        }
      : null
  );
  const [status, setStatus] = useState(initialData?.status || "Draft");
  const [isInPark, setIsInPark] = useState(initialData?.isInPark || false);
  const [concessionFeeCategory, setConcessionFeeCategory] = useState(
    initialData?.concessionFeeCategory || ""
  );
  const [concessionFees, setConcessionFees] = useState(
    Array.isArray(initialData?.concessionFees) ? initialData.concessionFees : []
  );
  const [pricing, setPricing] = useState(
    initialData?.pricing || {
      high_season: { categories: [] },
      mid_season: { categories: [] },
      low_season: { categories: [] },
    }
  );
  const [images, setImages] = useState(initialData?.images || []); // Array of { url, storagePath }
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seo?.description || ""
  );
  const [facilities, setFacilities] = useState(
    initialData?.facilities?.filter(Boolean) || [] // Sanitize initial facilities
  );

  // Image Cropper state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState(null);

  // Loading states
  const [loadingAccommodations, setLoadingAccommodations] = useState(false);
  const [loadingPlaceDetails, setLoadingPlaceDetails] = useState(false);

  // Cache for fetched accommodations to prevent redundant API calls
  const [accommodationCache, setAccommodationCache] = useState({});

  // New states for handling name uniqueness and slug checking
  const [isSlugUnique, setIsSlugUnique] = useState(true);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define default concession fees for all categories
  const defaultConcessionFees = {
    hotel: [
      {
        category: "Hotel",
        fees: {
          nonResident: 60, // from doc (non_EA_USD, adult 16+)
          resident: 13, // ~30,000 Tshs -> ~$13
          crew: 0, // doc doesn't specify crew; using 0
          childrenNonResident: 10, // from doc (non_EA_USD, child 5-15)
          childrenResident: 4, // ~10,000 Tshs -> ~$4
          expatriate: 60, // from doc (expatriate_resident_USD)
        },
      },
    ],

    permanent_camping: [
      {
        category: "Permanent Camping",
        fees: {
          nonResident: 65,
          resident: 15,
          crew: 0,
          childrenNonResident: 10,
          childrenResident: 5,
          expatriate: 60,
        },
      },
    ],

    public_camping: [
      {
        category: "Public Camping",
        fees: {
          nonResident: 50,
          resident: 4,
          crew: 0,
          childrenNonResident: 10,
          childrenResident: 3,
          expatriate: 50,
        },
      },
    ],

    seasonal_camping: [
      {
        category: "Seasonal Camping",
        fees: {
          // Approximating from doc "Seasonal Campsite fee, e.g. Serengeti (peak season)"
          // adult 16+: Non-EA: $60, EA: ~ $13, Exp: $60
          // We'll add a little more to differentiate from public camping
          nonResident: 70,
          resident: 15,
          crew: 0,
          childrenNonResident: 12,
          childrenResident: 5,
          expatriate: 70,
        },
      },
    ],

    special_campsite: [
      {
        category: "Special Campsite",
        fees: {
          nonResident: 70,
          resident: 18,
          crew: 0,
          childrenNonResident: 15,
          childrenResident: 7,
          expatriate: 70,
        },
      },
    ],

    migration_campsite: [
      {
        category: "Migration Campsite",
        fees: {
          nonResident: 70,
          resident: 20,
          crew: 0,
          childrenNonResident: 15,
          childrenResident: 8,
          expatriate: 70,
        },
      },
    ],
  };

  // Fetch destinations on mount
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const colRef = collection(db, "destinations");
        const snapshot = await getDocs(colRef);
        const destinationsData = snapshot.docs
          .map((doc) => {
            const data = doc.data();
            if (!data.title || !data.coordinates) {
              console.warn(`Destination ${doc.id} is missing required fields.`);
              return null; // Skip incomplete documents
            }
            return {
              value: doc.id,
              label: data.title,
              coordinates: data.coordinates, // { lat, lng }
            };
          })
          .filter((dest) => dest !== null); // Remove null entries
        setDestinations(destinationsData);
      } catch (error) {
        console.error("Error fetching destinations:", error);
        toast.error("Failed to fetch destinations.");
      }
    };

    fetchDestinations();
  }, []);

  // Fetch available accommodations when selectedDestination changes
  useEffect(() => {
    const fetchAccommodations = async () => {
      if (!selectedDestination) {
        setAvailableAccommodations([]);
        return;
      }

      const destination = destinations.find(
        (dest) => dest.value === selectedDestination
      );

      if (!destination) {
        console.error("Selected destination does not exist.");
        toast.error("Selected destination does not exist.");
        setAvailableAccommodations([]);
        return;
      }

      const { lat, lng } = destination.coordinates || {};

      if (!lat || !lng) {
        console.error(
          "Selected destination is invalid or missing coordinates."
        );
        toast.error("Selected destination is invalid or missing coordinates.");
        setAvailableAccommodations([]);
        return;
      }

      const cacheKey = `${selectedDestination}`;

      if (accommodationCache[cacheKey]) {
        setAvailableAccommodations(accommodationCache[cacheKey]);
        return;
      }

      setLoadingAccommodations(true);

      try {
        const response = await axios.get("/api/accommodations/fetchNearby", {
          params: { destinationId: selectedDestination },
        });

        const fetchedAccommodations = response.data.accommodations;

        setAvailableAccommodations(fetchedAccommodations);
        setAccommodationCache((prev) => ({
          ...prev,
          [cacheKey]: fetchedAccommodations,
        }));
      } catch (error) {
        console.error("Error fetching accommodations via API route:", error);
        // Display a user-friendly error message
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          toast.error(
            `Failed to fetch accommodations: ${error.response.data.error}`
          );
        } else {
          toast.error("Failed to fetch accommodations.");
        }
        setAvailableAccommodations([]);
      } finally {
        setLoadingAccommodations(false);
      }
    };

    fetchAccommodations();
  }, [selectedDestination, destinations, accommodationCache]);

  // Function to check slug uniqueness
  const checkSlugUniqueness = useCallback(async (nameToCheck) => {
    if (!nameToCheck) {
      setIsSlugUnique(true);
      return;
    }

    const slug = slugify(nameToCheck);
    setCheckingSlug(true);

    try {
      const response = await axios.get("/api/accommodations/checkSlug", {
        params: { slug },
      });

      if (response.data.exists) {
        setIsSlugUnique(false);
      } else {
        setIsSlugUnique(true);
      }
    } catch (error) {
      console.error("Error checking slug uniqueness:", error);
      // Assume slug is unique in case of error to not block user
      setIsSlugUnique(true);
    } finally {
      setCheckingSlug(false);
    }
  }, []);

  // Debounce the slug check to avoid excessive API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!isEditMode) {
        // Only check when creating, not editing
        checkSlugUniqueness(name);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [name, checkSlugUniqueness, isEditMode]);

  // Handle Destination Selection
  const handleDestinationChange = (selectedOption) => {
    setSelectedDestination(selectedOption ? selectedOption.value : null);
    setName(""); // Reset name when destination changes
    setSelectedAccommodation(null); // Reset selected accommodation
    setAvailableAccommodations([]); // Reset available accommodations
    setWebsite("");
    setPhone("");
    setLevelCategory("");
    setDescription("");
    setImages([]);
    setConcessionFees([]);
    setConcessionFeeCategory("");
    setPricing({
      high_season: { categories: [] },
      mid_season: { categories: [] },
      low_season: { categories: [] },
    });
    setSeoTitle("");
    setSeoDescription("");
    setFacilities([]); // Reset facilities
    setIsSlugUnique(true); // Reset slug uniqueness
  };

  // Handle Accommodation Selection or Creation
  const handleAccommodationChange = async (selectedOption) => {
    setSelectedAccommodation(selectedOption);
    if (selectedOption && selectedOption.label) {
      if (!isEditMode) {
        // Only set name if creating
        setName(selectedOption.label);
      }

      // If the selected accommodation has a placeId, fetch detailed info
      if (selectedOption.placeId) {
        setLoadingPlaceDetails(true);
        try {
          // Fetch accommodation details from Google API via a dedicated API route
          const response = await axios.get(
            "/api/accommodations/fetchAccommodationDetails",
            {
              params: { placeId: selectedOption.placeId },
            }
          );

          if (response.data.placeDetails) {
            const details = response.data.placeDetails;
            setWebsite(details.website || "");
            setPhone(details.formatted_phone_number || "");
            setLevelCategory(
              determineLevelCategory(details.rating, details.price_level)
            );
            setDescription(
              details.formatted_address || "" // If description is not provided, use address
            );
            // Optionally, set images or other details if available
          } else {
            toast.warn(
              "No detailed information available for the selected accommodation."
            );
          }
        } catch (error) {
          console.error("Error fetching place details:", error);
          // Display a user-friendly error message
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            toast.error(
              `Failed to fetch accommodation details: ${error.response.data.error}`
            );
          } else {
            toast.error("Failed to fetch accommodation details.");
          }
        } finally {
          setLoadingPlaceDetails(false);
        }
      } else {
        // If no placeId, reset detailed fields
        setWebsite("");
        setPhone("");
        setLevelCategory("");
        setDescription("");
        setImages([]);
      }
    } else {
      if (!isEditMode) {
        // Only reset if creating
        setName("");
      }
      setWebsite("");
      setPhone("");
      setLevelCategory("");
      setDescription("");
      setImages([]);
      setConcessionFees([]);
      setConcessionFeeCategory("");
      setPricing({
        high_season: { categories: [] },
        mid_season: { categories: [] },
        low_season: { categories: [] },
      });
      setSeoTitle("");
      setSeoDescription("");
      setFacilities([]);
    }
  };

  /**
   * Determines the level category based on rating and price level.
   * Adjust the logic as per your criteria.
   * @param {number} rating - Average user rating.
   * @param {number} priceLevel - Price level (1 to 4).
   * @returns {string} - Level category (e.g., "3-Star")
   */
  const determineLevelCategory = (rating, priceLevel) => {
    if (rating && priceLevel) {
      // Example logic: Map priceLevel to star rating
      // priceLevel 1 -> 1-Star, 2 -> 2-Star, etc.
      return `${priceLevel}-Star`;
    }
    return "";
  };

  // Handle "Is in Park?" Toggle
  const handleIsInParkToggle = () => {
    const newValue = !isInPark;
    setIsInPark(newValue);

    if (newValue && concessionFeeCategory) {
      // Automatically fill concession fees based on category
      const defaultFees = defaultConcessionFees[concessionFeeCategory] || [];
      if (defaultFees.length > 0) {
        setConcessionFees(defaultFees);
      } else {
        toast.info(
          "No default fees available for the selected category. Please add concession fees manually."
        );
        setConcessionFees([]);
      }
    } else {
      // Clear concession fees if not in park
      setConcessionFees([]);
    }
  };

  // Handle Concession Fee Category Change
  const handleConcessionFeeCategoryChange = (selectedOption) => {
    setConcessionFeeCategory(selectedOption ? selectedOption.value : "");
    if (isInPark && selectedOption) {
      // Automatically fill concession fees based on category
      const defaultFees = defaultConcessionFees[selectedOption.value] || [];
      if (defaultFees.length > 0) {
        setConcessionFees(defaultFees);
      } else {
        toast.info(
          "No default fees available for the selected category. Please add concession fees manually."
        );
        setConcessionFees([]);
      }
    } else {
      setConcessionFees([]);
    }
  };

  // Handle adding a new concession fee manually
  const handleAddConcessionFee = () => {
    setConcessionFees([
      ...concessionFees,
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
  };

  // Handle removing a concession fee
  const handleRemoveConcessionFee = (index) => {
    setConcessionFees(concessionFees.filter((_, i) => i !== index));
  };

  // Handle updating concession fee categories and fees
  const handleConcessionFeeChange = (index, field, value) => {
    const updatedFees = [...concessionFees];
    if (field.includes("fees.")) {
      const feeField = field.split("fees.")[1];
      updatedFees[index].fees[feeField] = value;
    } else {
      updatedFees[index][field] = value;
    }
    setConcessionFees(updatedFees);
  };

  // Handle Pricing
  const handleAddPricing = (season) => {
    setPricing((prev) => ({
      ...prev,
      [season]: {
        ...prev[season],
        categories: [
          ...(prev[season]?.categories || []),
          { chargeCategory: "", rackPrice: "", stoPrice: "" },
        ],
      },
    }));
  };

  const handleRemovePricing = (season, index) => {
    setPricing((prev) => ({
      ...prev,
      [season]: {
        ...prev[season],
        categories: prev[season].categories.filter((_, i) => i !== index),
      },
    }));
  };

  const handlePricingChange = (season, index, field, value) => {
    const updatedPricing = { ...pricing };
    updatedPricing[season].categories[index][field] = value;
    setPricing(updatedPricing);
  };

  // Handle Facilities (Amenities) Change
  const handleFacilitiesChange = (selectedOptions) => {
    setFacilities(selectedOptions.map((option) => option.value));
  };

  // Handle Image Selection and Cropping
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Use FileReader to convert file to data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImageFile(reader.result); // Data URL
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    try {
      const fileName = `${uuidv4()}.jpg`;
      const storageRef = ref(storage, `accommodations/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, croppedBlob);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Image upload error:", error);
          toast.error("Failed to upload image.");
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setImages((prevImages) => [
              ...prevImages,
              { url: downloadURL, storagePath: storageRef.fullPath },
            ]);
            toast.success("Image uploaded successfully!");
          } catch (urlError) {
            console.error("Error getting download URL:", urlError);
            toast.error("Failed to retrieve image URL.");
          } finally {
            setCropModalOpen(false);
            setCurrentImageFile(null);
          }
        }
      );
    } catch (error) {
      console.error("Error uploading cropped image:", error);
      toast.error("Failed to upload cropped image.");
    }
  };

  const handleCancelCrop = () => {
    setCropModalOpen(false);
    setCurrentImageFile(null);
  };

  // SEO Generation
  const handleSEOGeneration = () => {
    const destination = destinations.find(
      (dest) => dest.value === selectedDestination
    );
    const zoneLabel = zone ? zone.label : "your area";
    const amenitiesList = amenities.map((a) => a.label).join(", ");
    const pricingCategories = ["high_season", "mid_season", "low_season"];
    let pricingInfo = "";

    pricingCategories.forEach((season) => {
      if (pricing[season].categories.length > 0) {
        pricingInfo += `${capitalizeWords(season.replace("_", " "))}: `;
        pricing[season].categories.forEach((category) => {
          if (category.chargeCategory) {
            pricingInfo += `${capitalizeWords(
              category.chargeCategory.replace(/_/g, " ")
            )} Rack Price $${category.rackPrice}, STO Price $${
              category.stoPrice
            }; `;
          }
        });
      }
    });

    const title = `Stay at ${name} - Your Perfect Getaway in ${
      destination?.label || ""
    }`;
    const description = `${name} offers ${amenitiesList} amenities in the ${zoneLabel} of ${
      destination?.label || ""
    }. Enjoy comfortable accommodations with top-notch services. Pricing includes ${pricingInfo.trim()}. Book your stay today!`;

    setSeoTitle(title);
    setSeoDescription(description);
  };

  // Handle Remove Image
  const handleRemoveImage = async (index) => {
    const imageToRemove = images[index];
    if (!imageToRemove) return;

    try {
      // Delete the image from Firebase Storage
      await deleteObject(ref(storage, imageToRemove.storagePath));

      // Remove the image from the state
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);

      toast.success("Image removed successfully.");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image.");
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !description || !selectedDestination || images.length <1) {
      toast.error(
        "Please fill in all required fields and upload at least 1images."
      );
      return;
    }

    if (!isSlugUnique && !isEditMode) {
      toast.error("An accommodation with this name already exists.");
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    // Prepare form data
    const destination = destinations.find(
      (dest) => dest.value === selectedDestination
    );

    // Sanitize facilities array
    const sanitizedFacilities = facilities.filter(Boolean);

    let accommodationData = {};

    if (selectedAccommodation?.placeId) {
      // Accommodation selected from Google Places API
      accommodationData = {
        name: selectedAccommodation.label,
        placeId: selectedAccommodation.placeId,
        address: selectedAccommodation.address,
        location: selectedAccommodation.location,
        destinationId: selectedDestination,
        title: destination?.label || "",
        status,
        images: images.map((img) => ({
          url: img.url,
          storagePath: img.storagePath,
        })),
        description,
        website,
        phoneNumber: phone,
        levelCategory,
        amenities: amenities.map((a) => a.value),
        zone: zone ? zone.value : "",
        isInPark,
        concessionFeeCategory: isInPark ? concessionFeeCategory : null,
        concessionFees: isInPark ? concessionFees : [],
        pricing,
        facilities: sanitizedFacilities, // Use sanitized facilities
        seo: {
          title: seoTitle,
          description: seoDescription,
        },
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Accommodation manually entered; create a new accommodation
      const slug = slugify(name);
      accommodationData = {
        name,
        name_lowercase: name.toLowerCase(),
        slug,
        destinationId: selectedDestination,
        title: destination?.label || "",
        status,
        images: images.map((img) => ({
          url: img.url,
          storagePath: img.storagePath,
        })),
        description,
        website,
        phoneNumber: phone,
        levelCategory,
        amenities: amenities.map((a) => a.value),
        zone: zone ? zone.value : "",
        isInPark,
        concessionFeeCategory: isInPark ? concessionFeeCategory : null,
        concessionFees: isInPark ? concessionFees : [],
        pricing,
        facilities: sanitizedFacilities, // Use sanitized facilities
        seo: {
          title: seoTitle,
          description: seoDescription,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      if (isEditMode) {
        // Update existing accommodation via API route
        const response = await axios.put(
          "/api/accommodations/edit",
          accommodationData
        );
        if (response.status === 200) {
          toast.success("Accommodation updated successfully!");
          onSuccess();
        } else {
          toast.error("Failed to update accommodation.");
        }
      } else {
        // Create new accommodation via API route
        const response = await axios.post(
          "/api/accommodations/create",
          accommodationData
        );
        if (response.status === 201) {
          toast.success("Accommodation created successfully!");
          onSuccess();
        } else {
          toast.error("Failed to create accommodation.");
        }
      }
    } catch (error) {
      console.error("Error submitting accommodation:", error);
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(
          `Failed to submit accommodation: ${error.response.data.error}`
        );
      } else {
        toast.error("Failed to submit accommodation.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Utility function to capitalize words
  function capitalizeWords(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Destination Selection */}
      <div>
        <label className="block mb-2 font-semibold">
          Destination<span className="text-red-500">*</span>
        </label>
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
          placeholder="Select or Type Accommodation"
          isClearable
          isSearchable
          onCreateOption={(inputValue) => {
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
          }}
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
        {checkingSlug && (
          <p className="text-sm text-gray-500">Checking availability...</p>
        )}
        {!isSlugUnique && (
          <p className="text-sm text-red-500">
            An accommodation with this name already exists.
          </p>
        )}
      </div>

      {/* "Is in Park?" Toggle */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isInPark"
          checked={isInPark}
          onChange={handleIsInParkToggle}
          className="h-4 w-4"
        />
        <label htmlFor="isInPark" className="select-none">
          Is in Park?
        </label>
      </div>

      {/* Concession Fee Category Selection (Visible only if "Is in Park?" is checked) */}
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
            onChange={handleConcessionFeeCategoryChange}
            placeholder="Select Concession Fee Category"
            isClearable
          />
        </div>
      )}

      {/* Concession Fees Form (Visible only if "Is in Park?" is checked) */}
      {isInPark && (
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
                  handleConcessionFeeChange(index, "category", e.target.value)
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
                      handleConcessionFeeChange(
                        index,
                        "fees.nonResident",
                        e.target.value
                      )
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
                      handleConcessionFeeChange(
                        index,
                        "fees.resident",
                        e.target.value
                      )
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
                      handleConcessionFeeChange(
                        index,
                        "fees.crew",
                        e.target.value
                      )
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
                      handleConcessionFeeChange(
                        index,
                        "fees.childrenNonResident",
                        e.target.value
                      )
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
                      handleConcessionFeeChange(
                        index,
                        "fees.childrenResident",
                        e.target.value
                      )
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
                      handleConcessionFeeChange(
                        index,
                        "fees.expatriate",
                        e.target.value
                      )
                    }
                    className="p-2 border rounded w-full"
                    required
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveConcessionFee(index)}
                className="text-red-500 mt-2 flex items-center hover:underline"
              >
                <BiTrash /> Remove Concession Fee
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddConcessionFee}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            + Add Concession Fee
          </button>
        </div>
      )}

      {/* Facilities (Amenities) Selection */}
      <div>
        <label className="block mb-2 font-semibold">
          Facilities (Amenities)
        </label>
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
            // Add more facilities as needed
          ]}
          value={facilities
            .filter((f) => f) // Removes any nulls or falsy values
            .map((f) => ({
              value: f,
              label: capitalizeWords(f.replace(/_/g, " ")),
            }))}
          onChange={(selectedOptions) =>
            handleFacilitiesChange(selectedOptions)
          }
          placeholder="Select Facilities"
          isClearable
        />
      </div>

      {/* Description */}
      <div>
        <label className="block mb-2 font-semibold">Description</label>
        <CKEditor
          editor={ClassicEditor}
          data={description}
          onChange={(event, editor) => {
            const data = editor.getData();
            setDescription(data);
          }}
        />
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

      {/* Phone */}
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

      {/* Zone Selection */}
      <div>
        <label className="block mb-2 font-semibold">Zone</label>
        <Select
          options={[
            { value: "in_the_park", label: "In the Park" },
            { value: "out_of_the_park", label: "Out of the Park" },
            { value: "beachside", label: "Beachside" },
            { value: "city_center", label: "City Center" },
            { value: "forest_edge", label: "Forest Edge" },
            { value: "mountain_view", label: "Mountain View" },
            { value: "lake_side", label: "Lake Side" },
            { value: "desert", label: "Desert" },
            { value: "savannah", label: "Savannah" },
            { value: "river_view", label: "River View" },
            { value: "hillside", label: "Hillside" },
            { value: "island", label: "Island" },
            { value: "wetlands", label: "Wetlands" },
          ]}
          value={zone}
          onChange={(selectedOption) => setZone(selectedOption)}
          placeholder="Select Zone"
        />
      </div>

      {/* Status Selection */}
      <div>
        <label className="block mb-2 font-semibold">Status</label>
        <Select
          options={[
            { value: "Draft", label: "Draft" },
            { value: "Published", label: "Published" },
          ]}
          value={{ value: status, label: status }}
          onChange={(selectedOption) => setStatus(selectedOption.value)}
          placeholder="Select Status"
        />
      </div>

      {/* Accommodation Prices */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Accommodation Prices</h3>
        {[
          {
            key: "high_season",
            label: "High Season (July, August, Dec 20th - Jan 10th)",
          },
          {
            key: "mid_season",
            label: "Mid Season (Rest of the year)",
          },
          {
            key: "low_season",
            label: "Low Season (April 1st - May 19th)",
          },
        ].map((season) => (
          <div key={season.key} className="mb-4">
            <h4 className="font-semibold mb-2">{season.label}</h4>
            {pricing[season.key].categories.map((category, index) => (
              <div
                key={`${season.key}-${index}`}
                className="border p-2 rounded mb-2"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    options={[
                      { value: "per_person", label: "Per Person" },
                      {
                        value: "per_person_sharing",
                        label: "Per Person Sharing",
                      },
                    ]}
                    value={
                      category.chargeCategory
                        ? {
                            value: category.chargeCategory,
                            label: capitalizeWords(
                              category.chargeCategory.replace(/_/g, " ")
                            ),
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handlePricingChange(
                        season.key,
                        index,
                        "chargeCategory",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    placeholder="Charge Category"
                  />

                  <div>
                    <label className="block mb-1">Rack Price ($)</label>
                    <input
                      type="number"
                      placeholder="Rack Price"
                      value={category.rackPrice}
                      onChange={(e) =>
                        handlePricingChange(
                          season.key,
                          index,
                          "rackPrice",
                          e.target.value
                        )
                      }
                      className="p-2 border rounded w-full"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">STO Price ($)</label>
                    <input
                      type="number"
                      placeholder="STO Price"
                      value={category.stoPrice}
                      onChange={(e) =>
                        handlePricingChange(
                          season.key,
                          index,
                          "stoPrice",
                          e.target.value
                        )
                      }
                      className="p-2 border rounded w-full"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePricing(season.key, index)}
                  className="text-red-500 mt-2 flex items-center hover:underline"
                >
                  <BiTrash /> Remove Pricing
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddPricing(season.key)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              + Add Pricing
            </button>
          </div>
        ))}
      </div>

      {/* Image Upload and Cropping */}
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
                  height={84}
                  className="object-cover rounded"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-500 absolute top-1 right-1 bg-white rounded-full p-1 hover:bg-red-100 transition-colors"
                >
                  <BiTrash size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO Generation */}
      <div className="border p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">SEO Settings</h3>
        <button
          type="button"
          onClick={handleSEOGeneration}
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
          disabled={!isSlugUnique || checkingSlug || isSubmitting}
          className={`bg-blue-600 text-white p-3 rounded w-full mt-6 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-semibold ${
            (!isSlugUnique || checkingSlug || isSubmitting) &&
            "opacity-50 cursor-not-allowed"
          }`}
        >
          {isEditMode ? "Update Accommodation" : "Create Accommodation"}
        </button>
      </div>

      {/* Image Cropper Modal */}
      {cropModalOpen && currentImageFile && (
        <ImageCropper
          imgUrl={currentImageFile}
          aspectRatio={1} // 1:1 aspect ratio for square images
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}

      {/* Loading Indicator for Place Details */}
      {loadingPlaceDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <p>Loading accommodation details...</p>
          </div>
        </div>
      )}
    </form>
  );
};

// PropTypes validation
AccommodationForm.propTypes = {
  initialData: PropTypes.object, // Data for editing, null for creating
  onSuccess: PropTypes.func.isRequired, // Callback after success
  isEditMode: PropTypes.bool.isRequired, // Determines form mode
};

export default AccommodationForm;
