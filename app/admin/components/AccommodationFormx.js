// app/admin/accommodations/components/AccommodationForm.js

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { db, storage } from "@/app/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImageCropper from "@/app/components/ImageCropper";
import PropTypes from "prop-types";
import { slugify } from "@/app/lib/helpers"; // Helper function to generate slugs
import axios from "axios";

const AccommodationForm = ({ initialData, onSuccess, isEditMode }) => {
  const router = useRouter();

  // State variables
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(
    initialData?.destinationId || null
  );
  const [availableAccommodations, setAvailableAccommodations] = useState([]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(
    initialData?.slug
      ? {
          value: initialData.accommodationId || initialData.slug,
          label: initialData.name,
          address: initialData.address || "",
          placeId: initialData.placeId || "",
          location: initialData.location || { lat: 0, lng: 0 },
          types: initialData.types || [],
          rating: initialData.rating || null,
          userRatingsTotal: initialData.userRatingsTotal || null,
          website: initialData.website || "",
          phoneNumber: initialData.phoneNumber || "",
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
      low_season: { categories: [] },
    }
  );
  const [images, setImages] = useState(initialData?.images || []); // Array of { url, storagePath }
  const [seoTitle, setSeoTitle] = useState(initialData?.seo?.title || "");
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seo?.description || ""
  );
  const [facilities, setFacilities] = useState(initialData?.facilities || []);

  // Image Cropper state
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState(null);

  // Loading states
  const [loadingAccommodations, setLoadingAccommodations] = useState(false);
  const [loadingPlaceDetails, setLoadingPlaceDetails] = useState(false); // New state for loading place details

  // Cache for fetched accommodations to prevent redundant API calls
  const [accommodationCache, setAccommodationCache] = useState({});

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

      const cacheKey = `${lat},${lng}`;
      if (accommodationCache[cacheKey]) {
        setAvailableAccommodations(accommodationCache[cacheKey]);
        return;
      }

      setLoadingAccommodations(true);

      try {
        const response = await axios.get("/api/fetchAccommodations", {
          params: { lat, lng },
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
      low_season: { categories: [] },
    });
    // Fetch accommodations based on new destination is handled by useEffect
  };

  // Handle Accommodation Selection or Creation
  const handleAccommodationChange = async (selectedOption) => {
    setSelectedAccommodation(selectedOption);
    if (selectedOption && selectedOption.label) {
      setName(selectedOption.label);

      // If the selected accommodation has a placeId, fetch detailed info
      if (selectedOption.placeId) {
        setLoadingPlaceDetails(true);
        try {
          const response = await axios.get("/api/getPlaceDetails", {
            params: { placeId: selectedOption.placeId },
          });

          if (response.data.placeDetails) {
            const details = response.data.placeDetails;
            setWebsite(details.website || "");
            setPhone(details.phoneNumber || "");
            setLevelCategory(
              determineLevelCategory(details.rating, details.priceLevel)
            );
            setDescription(details.description || ""); // If description is not provided, leave it empty
            // Removed photo auto-fill
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
      setName("");
      setWebsite("");
      setPhone("");
      setLevelCategory("");
      setDescription("");
      setImages([]);
      setConcessionFees([]);
      setConcessionFeeCategory("");
      setPricing({
        high_season: { categories: [] },
        low_season: { categories: [] },
      });
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
      setConcessionFees(defaultFees);
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
      setConcessionFees(defaultFees);
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
          { chargeCategory: "", roomType: "", racketPrice: "", stoPrice: "" },
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
    setFacilities(selectedOptions || []);
  };

  // Handle Image Selection and Cropping
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImageFile(reader.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedBlob) => {
    try {
      const storageRef = ref(
        storage,
        `accommodations/${uuidv4()}-${croppedBlob.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, croppedBlob);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Image upload error:", error);
          toast.error("Failed to upload image.");
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImages([
            ...images,
            { url: downloadURL, storagePath: storageRef.fullPath },
          ]);
          toast.success("Image uploaded successfully!");
        }
      );
    } catch (error) {
      console.error("Error uploading cropped image:", error);
      toast.error("Failed to upload cropped image.");
    } finally {
      setCropModalOpen(false);
      setCurrentImageFile(null);
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
    const highSeason =
      pricing.high_season.categories.length > 0
        ? "High Season"
        : "the Best Time";
    const lowSeason =
      pricing.low_season.categories.length > 0 ? "Low Season" : "the Best Time";

    const title = `Stay at ${name} - Your Perfect Getaway in ${
      destination?.label || ""
    }`;
    const description = `${name} offers ${amenitiesList} amenities in the ${zoneLabel} of ${
      destination?.label || ""
    }. Enjoy comfortable accommodations with top-notch services. Book your stay during ${highSeason} and ${lowSeason}!`;

    setSeoTitle(title);
    setSeoDescription(description);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !description || !selectedDestination || images.length < 4) {
      toast.error(
        "Please fill in all required fields and upload at least four images."
      );
      return;
    }

    if (isInPark && concessionFeeCategory && concessionFees.length === 0) {
      toast.error("Please add at least one concession fee.");
      return;
    }

    // Prepare form data
    const destination = destinations.find(
      (dest) => dest.value === selectedDestination
    );

    let accommodationId = selectedAccommodation?.value;
    let accommodationData = {};

    if (selectedAccommodation?.placeId) {
      // Accommodation selected from Google Places API
      accommodationData = {
        name: selectedAccommodation.label,
        placeId: selectedAccommodation.placeId,
        address: selectedAccommodation.address,
        location: selectedAccommodation.location,
        destinationId: selectedDestination,
        types: selectedAccommodation.types,
        rating: selectedAccommodation.rating,
        userRatingsTotal: selectedAccommodation.userRatingsTotal,
        website: selectedAccommodation.website,
        phoneNumber: selectedAccommodation.phoneNumber,
      };
    } else {
      // Accommodation manually entered; create a new accommodation in Firestore
      try {
        // Check for existing accommodation with the same name
        const accommodationsCol = collection(db, "accommodations");
        const qQuery = query(accommodationsCol, where("name", "==", name));
        const snapshot = await getDocs(qQuery);
        if (!snapshot.empty && !isEditMode) {
          toast.error("An accommodation with this name already exists.");
          return;
        }

        if (!isEditMode) {
          const newAccommodationRef = await addDoc(accommodationsCol, {
            name: name,
            address: "", // Optionally, allow admin to input address
            location: null, // Optionally, allow admin to input coordinates
            destinationId: selectedDestination,
            types: [], // Optionally, allow admin to specify types
            createdAt: new Date(),
            updatedAt: new Date(),
          });
          accommodationId = newAccommodationRef.id;
          accommodationData = {
            name: name,
            placeId: null,
            address: "",
            location: null,
            destinationId: selectedDestination,
            types: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          };
        }
      } catch (error) {
        console.error("Error creating new accommodation:", error);
        toast.error("Failed to create new accommodation.");
        return;
      }
    }

    const formData = {
      name,
      slug: slugify(name),
      description,
      website,
      phoneNumber: phone,
      levelCategory,
      amenities: amenities.map((a) => a.value),
      zone: zone ? zone.value : null,
      status,
      isInPark,
      concessionFeeCategory: isInPark ? concessionFeeCategory : null,
      concessionFees: isInPark ? concessionFees : [],
      pricing,
      images: images.map((img) => ({
        url: img.url,
        storagePath: img.storagePath,
      })),
      seo: { title: seoTitle, description: seoDescription },
      destinationId: selectedDestination,
      title: destination?.label || "",
      facilities: facilities.map((f) => f.value),
      updatedAt: new Date(),
      accommodationId: accommodationId,
    };

    try {
      const accommodationRef = doc(db, "accommodations", formData.slug);

      if (isEditMode) {
        // Update existing accommodation
        await setDoc(accommodationRef, formData, { merge: true });
      } else {
        // Check if accommodation with the same slug exists
        const docSnap = await getDoc(accommodationRef);
        if (docSnap.exists()) {
          toast.error("An accommodation with this name already exists.");
          return;
        }
        // Create new accommodation
        await setDoc(accommodationRef, formData);
      }

      // Only one toast notification after successful submission
      toast.success(
        isEditMode
          ? "Accommodation updated successfully!"
          : "Accommodation created successfully!"
      );
      onSuccess();
    } catch (error) {
      console.error("Error submitting accommodation:", error);
      toast.error("Failed to submit accommodation.");
    }
  };

  // Utility function to capitalize words
  function capitalizeWords(str) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Define default concession fees based on category
  const defaultConcessionFees = {
    hotel: [
      {
        category: "Hotel",
        fees: {
          nonResident: 100,
          resident: 80,
          crew: 60,
          childrenNonResident: 50,
          childrenResident: 40,
          expatriate: 70,
        },
      },
    ],
    permanent_camping: [
      {
        category: "Permanent Camping",
        fees: {
          nonResident: 90,
          resident: 70,
          crew: 50,
          childrenNonResident: 40,
          childrenResident: 30,
          expatriate: 60,
        },
      },
    ],
    public_camping: [
      {
        category: "Public Camping",
        fees: {
          nonResident: 80,
          resident: 60,
          crew: 40,
          childrenNonResident: 30,
          childrenResident: 20,
          expatriate: 50,
        },
      },
    ],
    seasonal_camping: [
      {
        category: "Seasonal Camping",
        fees: {
          nonResident: 85,
          resident: 65,
          crew: 45,
          childrenNonResident: 35,
          childrenResident: 25,
          expatriate: 55,
        },
      },
    ],
    special_campsite: [
      {
        category: "Special Campsite",
        fees: {
          nonResident: 95,
          resident: 75,
          crew: 55,
          childrenNonResident: 45,
          childrenResident: 35,
          expatriate: 65,
        },
      },
    ],
    migration_campsite: [
      {
        category: "Migration Campsite",
        fees: {
          nonResident: 110,
          resident: 90,
          crew: 70,
          childrenNonResident: 60,
          childrenResident: 50,
          expatriate: 80,
        },
      },
    ],
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

      {/* Accommodation Selection */}
      <div>
        <label className="block mb-2 font-semibold">
          Accommodation<span className="text-red-500">*</span>
        </label>
        <CreatableSelect
          isClearable
          isSearchable
          isLoading={loadingAccommodations}
          options={availableAccommodations}
          value={selectedAccommodation}
          onChange={handleAccommodationChange}
          placeholder="Select or type an accommodation name"
        />
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
          value={facilities}
          onChange={handleFacilitiesChange}
          placeholder="Select Facilities"
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
            { value: "beachside", label: "Beachside" },
            { value: "city_center", label: "City Center" },
            { value: "forest_edge", label: "Forest Edge" },
            { value: "mountain_view", label: "Mountain View" },
            // Add more zones as needed
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
        {["high_season", "low_season"].map((season) => (
          <div key={season} className="mb-4">
            <h4 className="font-semibold mb-2 capitalize">
              {season.replace("_", " ")}
            </h4>
            {pricing[season].categories.map((category, index) => (
              <div
                key={`${season}-${index}`}
                className="border p-2 rounded mb-2"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    options={[
                      { value: "per_person", label: "Per Person" },
                      { value: "per_room", label: "Per Room" },
                      // Add more charge categories as needed
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
                        season,
                        index,
                        "chargeCategory",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    placeholder="Charge Category"
                  />
                  <Select
                    options={[
                      { value: "single", label: "Single" },
                      { value: "double", label: "Double" },
                      { value: "triple", label: "Triple" },
                      { value: "suite", label: "Suite" },
                      // Add more room types as needed
                    ]}
                    value={
                      category.roomType
                        ? {
                            value: category.roomType,
                            label: capitalizeWords(
                              category.roomType.replace(/_/g, " ")
                            ),
                          }
                        : null
                    }
                    onChange={(selectedOption) =>
                      handlePricingChange(
                        season,
                        index,
                        "roomType",
                        selectedOption ? selectedOption.value : ""
                      )
                    }
                    placeholder="Room Type"
                  />
                  <div>
                    <label className="block mb-1">Racket Price</label>
                    <input
                      type="number"
                      placeholder="Racket Price"
                      value={category.racketPrice}
                      onChange={(e) =>
                        handlePricingChange(
                          season,
                          index,
                          "racketPrice",
                          e.target.value
                        )
                      }
                      className="p-2 border rounded w-full"
                      // Removed 'required' to make it optional
                    />
                  </div>
                  <div>
                    <label className="block mb-1">STO Price</label>
                    <input
                      type="number"
                      placeholder="STO Price"
                      value={category.stoPrice}
                      onChange={(e) =>
                        handlePricingChange(
                          season,
                          index,
                          "stoPrice",
                          e.target.value
                        )
                      }
                      className="p-2 border rounded w-full"
                      // Removed 'required' to make it optional
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePricing(season, index)}
                  className="text-red-500 mt-2 flex items-center hover:underline"
                >
                  <BiTrash /> Remove Pricing
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleAddPricing(season)}
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
                  height={150}
                  className="object-cover rounded"
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
          className="bg-blue-600 text-white p-3 rounded w-full mt-6 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-semibold"
        >
          {isEditMode ? "Update Accommodation" : "Create Accommodation"}
        </button>
      </div>

      {/* Image Cropper Modal */}
      {cropModalOpen && (
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

// Utility function to capitalize words
function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default AccommodationForm;
