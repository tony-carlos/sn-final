"use client";

import React, { useState, useEffect, useCallback } from "react";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { db, storage } from "@/app/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
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
import { v4 as uuidv4 } from "uuid";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ImageCropper from "@/app/components/ImageCropper"; // Ensure this component exists
import PropTypes from "prop-types";
import axios from "axios";
import { useRouter } from "next/navigation"; // For redirection

// Utility function to generate slug from name
const slugify = (text) =>
  text
    ?.toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "") || ""; // Remove leading and trailing hyphens

const EditAccommodationForm = ({ slug, onSuccess }) => {
  const router = useRouter();

  // **Form State Variables**
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [phone, setPhone] = useState("");
  const [levelCategory, setLevelCategory] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [zone, setZone] = useState(null);
  const [status, setStatus] = useState("Draft");
  const [isInPark, setIsInPark] = useState(false);
  const [concessionFeeCategory, setConcessionFeeCategory] = useState("");
  const [concessionFees, setConcessionFees] = useState([]);
  const [pricing, setPricing] = useState({
    high_season: { categories: [] },
    mid_season: { categories: [] },
    low_season: { categories: [] },
  });
  const [images, setImages] = useState([]); // Array of { url, storagePath }
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  // Removed facilities state to avoid confusion

  // **Image Cropper State**
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageFile, setCurrentImageFile] = useState(null);

  // **Loading States**
  const [loadingAccommodations, setLoadingAccommodations] = useState(false);
  const [loadingPlaceDetails, setLoadingPlaceDetails] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);

  // **Cache for Fetched Accommodations**
  const [accommodationCache, setAccommodationCache] = useState({});

  // **Available Accommodations State**
  const [availableAccommodations, setAvailableAccommodations] = useState([]);

  // **Selected Accommodation State**
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);

  // **Slug Uniqueness States**
  const [isSlugUnique, setIsSlugUnique] = useState(true);
  const [checkingSlug, setCheckingSlug] = useState(false);

  // **Submission State**
  const [isSubmitting, setIsSubmitting] = useState(false);

  // **Input Value for CreatableSelect**
  const [inputValue, setInputValue] = useState("");

  // **Default Concession Fees**
  const defaultConcessionFees = {
    hotel: [
      {
        category: "Hotel",
        fees: {
          nonResident: 60,          // from doc (non_EA_USD, adult 16+)
          resident: 13,            // ~30,000 Tshs -> ~$13
          crew: 0,                 // doc doesn't specify crew; using 0
          childrenNonResident: 10, // from doc (non_EA_USD, child 5-15)
          childrenResident: 4,     // ~10,000 Tshs -> ~$4
          expatriate: 60           // from doc (expatriate_resident_USD)
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

  // **Utility Function: Capitalize Words**
  const capitalizeWords = (str) => {
    if (typeof str !== "string") {
      return "";
    }
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // **Function to Get Destination by ID**
  const getDestinationById = async (id) => {
    try {
      const docRef = doc(db, "destinations", id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.warn(`Destination with ID ${id} not found.`);
        return null;
      }
      const destData = docSnap.data();
      return {
        value: docSnap.id,
        label: destData.title,
        coordinates: destData.coordinates,
      };
    } catch (error) {
      console.error("Error fetching destination by ID:", error);
      return null;
    }
  };

  // **Fetch Initial Accommodation Data Based on Slug**
  useEffect(() => {
    const fetchInitialData = async () => {
      console.log("Fetching accommodation data for slug:", slug);
      try {
        const response = await axios.get(`/api/editaccommodations/${slug}`);
        console.log("API Response:", response.data);
        const { accommodation } = response.data;

        // Populate form fields with fetched data
        setName(accommodation.name || "");
        setDescription(accommodation.description || "");
        setWebsite(accommodation.website || "");
        setPhone(accommodation.phoneNumber || "");
        setLevelCategory(accommodation.levelCategory || "");
        setAmenities(
          accommodation.facilities
            ? accommodation.facilities.map((a) => a.toLowerCase())
            : []
        );
        setZone(
          accommodation.zone
            ? {
                value: accommodation.zone,
                label: capitalizeWords(accommodation.zone.replace(/_/g, " ")),
              }
            : null
        );
        setStatus(accommodation.status || "Draft");
        setIsInPark(accommodation.isInPark || false);
        setConcessionFeeCategory(accommodation.concessionFeeCategory || "");
        setConcessionFees(
          Array.isArray(accommodation.concessionFees)
            ? accommodation.concessionFees
            : []
        );
        setPricing({
          high_season: accommodation.pricing?.high_season || {
            categories: [],
          },
          mid_season: accommodation.pricing?.mid_season || { categories: [] },
          low_season: accommodation.pricing?.low_season || { categories: [] },
        });
        setImages(accommodation.images || []);
        setSeoTitle(accommodation.seo?.title || "");
        setSeoDescription(accommodation.seo?.description || "");

        // Set selected destination
        if (accommodation.destinationId) {
          const destination = await getDestinationById(
            accommodation.destinationId
          );
          if (destination) {
            setSelectedDestination({
              value: destination.value,
              label: destination.label,
              coordinates: destination.coordinates,
            });
          }
        }

        // Initialize CreatableSelect's inputValue
        setInputValue(accommodation.name || "");

        setLoadingInitialData(false);
      } catch (error) {
        console.error("Error fetching initial accommodation data:", error);

        if (error.response) {
          // Server responded with a status other than 2xx
          if (error.response.status === 404) {
            toast.error("Accommodation not found.");
          } else {
            toast.error(`Error: ${error.response.data.error}`);
          }
        } else if (error.request) {
          // Request was made but no response received
          toast.error("No response from server. Please try again later.");
        } else {
          // Something else caused the error
          toast.error("An unexpected error occurred.");
        }
        setLoadingInitialData(false);
      }
    };

    fetchInitialData();
  }, [slug]);

  // **Fetch Destinations on Mount**
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

  // **Fetch Nearby Accommodations When Selected Destination Changes**
  useEffect(() => {
    const fetchAccommodations = async () => {
      if (!selectedDestination) {
        setAvailableAccommodations([]);
        return;
      }

      const cacheKey = `${selectedDestination.value}`;

      if (accommodationCache[cacheKey]) {
        setAvailableAccommodations(accommodationCache[cacheKey]);
        return;
      }

      setLoadingAccommodations(true);

      try {
        const response = await axios.get(
          "/api/editaccommodations/fetchNearby",
          {
            params: { destinationId: selectedDestination.value },
          }
        );
        console.log("Fetched Accommodations:", response.data.accommodations);

        const fetchedAccommodations = response.data.accommodations.map(
          (acc) => ({
            value: acc.placeId,
            label: acc.label,
            placeId: acc.placeId,
            category: acc.category,
            address: acc.address,
            location: acc.location,
            types: acc.types,
            website: acc.website || "",
            phoneNumber: acc.phoneNumber || "",
          })
        );

        setAvailableAccommodations(fetchedAccommodations);
        setAccommodationCache((prev) => ({
          ...prev,
          [cacheKey]: fetchedAccommodations,
        }));
      } catch (error) {
        console.error(
          "Error fetching nearby accommodations via API route:",
          error
        );
        toast.error("Failed to fetch nearby accommodations.");
        setAvailableAccommodations([]);
      } finally {
        setLoadingAccommodations(false);
      }
    };

    fetchAccommodations();
  }, [selectedDestination, accommodationCache]);

  // **Slug Uniqueness Check**
  const checkSlugUniqueness = useCallback(
    async (newSlug) => {
      if (!newSlug) {
        setIsSlugUnique(true);
        return;
      }

      setCheckingSlug(true);

      try {
        const response = await axios.get("/api/editaccommodations/checkSlug", {
          params: { slug: newSlug, currentSlug: slug }, // Pass currentSlug to exclude it
        });

        // If the slug exists and it's different from the current slug, it's not unique
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
    },
    [slug]
  );

  // **Debounce the Slug Check to Avoid Excessive API Calls**
  useEffect(() => {
    const newSlug = slugify(name);

    if (newSlug === slug) {
      setIsSlugUnique(true);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      checkSlugUniqueness(newSlug);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [name, checkSlugUniqueness, slug]);

  // **Handle Destination Selection**
  const handleDestinationChange = (selectedOption) => {
    setSelectedDestination(selectedOption ? selectedOption : null);
    setSelectedAccommodation(null); // Reset selected accommodation
    setAvailableAccommodations([]); // Reset available accommodations

    // Reset only accommodation name-related fields
    setName(""); // Accommodation Name
    setIsSlugUnique(true); // Reset slug uniqueness check
    setInputValue(""); // Reset inputValue
  };

  // **Handle Accommodation Selection or Creation**
  const handleAccommodationChange = async (selectedOption) => {
    if (!selectedOption) {
      setSelectedAccommodation(null);
      return;
    }

    // Check if the selected accommodation is different from the current one
    if (selectedOption.value !== selectedAccommodation?.value) {
      // Different accommodation selected or created
      setSelectedAccommodation(selectedOption);
      setName(selectedOption.label); // Update name based on selection
      setInputValue(selectedOption.label); // Sync inputValue with name

      // Fetch detailed info if necessary
      if (selectedOption.placeId) {
        setLoadingPlaceDetails(true);
        try {
          // Fetch accommodation details from Google API via a dedicated API route
          const response = await axios.get(
            "/api/editaccommodations/fetchAccommodationDetails",
            {
              params: { placeId: selectedOption.placeId },
            }
          );

          if (response.data.placeDetails) {
            const details = response.data.placeDetails;
            setWebsite(details.website || "");
            setPhone(details.phoneNumber || "");
            setLevelCategory(determineLevelCategory(details.priceLevel));
            setDescription(details.address || ""); // Use address if no description
          } else {
            toast.warn(
              "No detailed information available for the selected accommodation."
            );
          }
        } catch (error) {
          console.error("Error fetching place details:", error);
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
      }
    } else {
      // Same accommodation selected, only update the name and slug
      setSelectedAccommodation(selectedOption);
      setName(selectedOption.label);
      setInputValue(selectedOption.label);
    }
  };

  /**
   * Determines the level category based on price level.
   * Adjust the logic as per your criteria.
   * @param {number} priceLevel - Price level (1 to 4).
   * @returns {string} - Level category (e.g., "3-Star")
   */
  const determineLevelCategory = (priceLevel) => {
    if (priceLevel) {
      // Example logic: Map priceLevel to star rating
      return `${priceLevel}-Star`;
    }
    return "";
  };

  // **Handle "Is in Park?" Toggle**
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

  // **Handle Concession Fee Category Change**
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

  // **Handle Adding a New Concession Fee Manually**
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

  // **Handle Removing a Concession Fee**
  const handleRemoveConcessionFee = (index) => {
    setConcessionFees(concessionFees.filter((_, i) => i !== index));
  };

  // **Handle Updating Concession Fee Categories and Fees**
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

  // **Handle Pricing: Adding a New Pricing Category**
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

  // **Handle Pricing: Removing a Pricing Category**
  const handleRemovePricing = (season, index) => {
    setPricing((prev) => ({
      ...prev,
      [season]: {
        ...prev[season],
        categories: prev[season].categories.filter((_, i) => i !== index),
      },
    }));
  };

  // **Handle Pricing: Updating a Pricing Category**
  const handlePricingChange = (season, index, field, value) => {
    setPricing((prev) => {
      const updatedPricing = { ...prev };
      if (!updatedPricing[season]) {
        updatedPricing[season] = { categories: [] };
      }
      if (!updatedPricing[season].categories[index]) {
        updatedPricing[season].categories[index] = {
          chargeCategory: "",
          rackPrice: "",
          stoPrice: "",
        };
      }
      updatedPricing[season].categories[index][field] = value;
      return updatedPricing;
    });
  };

  // **Handle Facilities (Amenities) Change**
  const handleFacilitiesChange = (selectedOptions) => {
    setAmenities(selectedOptions.map((option) => option.value));
  };

  // **Handle Image Selection and Cropping**
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

  // **Handle Crop Completion**
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

  // **Handle Crop Cancellation**
  const handleCancelCrop = () => {
    setCropModalOpen(false);
    setCurrentImageFile(null);
  };

  // **Handle SEO Generation**
  const handleSEOGeneration = () => {
    const destination = destinations.find(
      (dest) => dest.value === selectedDestination?.value
    );
    const zoneLabel = zone ? zone.label : "your area";
    const amenitiesList = amenities
      .map((a) => capitalizeWords(a.replace(/_/g, " ")))
      .join(", ");
    const pricingCategories = ["high_season", "mid_season", "low_season"];
    let pricingInfo = "";

    pricingCategories.forEach((season) => {
      if (pricing[season]?.categories?.length > 0) {
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

  // **Handle Remove Image**
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

  // **Handle Form Submission**
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!name || !description || !selectedDestination || images.length < 1) {
      toast.error(
        "Please fill in all required fields and upload at least four images."
      );
      return;
    }

    if (!isSlugUnique) {
      toast.error("An accommodation with this slug already exists.");
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    // Prepare form data
    const destination = destinations.find(
      (dest) => dest.value === selectedDestination.value
    );

    // Sanitize amenities array
    const sanitizedAmenities = amenities.filter(Boolean);

    // Generate new slug from name
    const newSlug = slugify(name);

    const accommodationData = {
      name,
      slug: newSlug, // Update slug based on name
      name_lowercase: name.toLowerCase(),
      destinationId: selectedDestination.value,
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
      amenities: sanitizedAmenities, // Use sanitized amenities
      zone: zone ? zone.value : "",
      isInPark,
      concessionFeeCategory: isInPark ? concessionFeeCategory : null,
      concessionFees: isInPark ? concessionFees : [],
      pricing: {
        high_season: {
          categories: pricing.high_season.categories || [],
        },
        mid_season: {
          categories: pricing.mid_season.categories || [],
        },
        low_season: {
          categories: pricing.low_season.categories || [],
        },
      },
      seo: {
        title: seoTitle,
        description: seoDescription,
      },
      updatedAt: new Date().toISOString(),
    };

    try {
      // Check if the new slug is different from the current slug
      const slugChanged = newSlug !== slug;

      if (slugChanged) {
        // Check if the new slug already exists
        const slugCheckResponse = await axios.get(
          "/api/editaccommodations/checkSlug",
          {
            params: { slug: newSlug, currentSlug: slug }, // Pass currentSlug to exclude it
          }
        );

        if (slugCheckResponse.data.exists) {
          toast.error("An accommodation with the new slug already exists.");
          setIsSubmitting(false);
          return;
        }
      }

      // Update accommodation via API route
      const response = await axios.put(
        `/api/editaccommodations/${slug}`,
        accommodationData
      );

      if (response.status === 200) {
        toast.success("Accommodation updated successfully!");

        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(); // Invoke the onSuccess callback if provided
        }

        if (slugChanged) {
          // Redirect to the new slug's edit page
          router.push(`/admin/accommodations/${newSlug}/edit`);
        } else {
          // Redirect to accommodations list or another page
          router.push("/admin/accommodations");
        }
      } else {
        toast.error("Failed to update accommodation.");
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

  return (
    <>
      {loadingInitialData ? (
        <div className="flex items-center justify-center h-full">
          <p>Loading accommodation data...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* **Destination Selection** */}
          <div>
            <label className="block mb-2 font-semibold">
              Destination<span className="text-red-500">*</span>
            </label>
            <Select
              options={destinations}
              value={selectedDestination}
              onChange={handleDestinationChange}
              placeholder="Select Destination"
              isClearable
              required
            />
          </div>

          {/* **Accommodation Selection or Creation** */}
          <div>
            <label className="block mb-2 font-semibold">
              Accommodation Name<span className="text-red-500">*</span>
            </label>
            <CreatableSelect
              options={availableAccommodations.map((acc) => ({
                value: acc.placeId,
                label: acc.label,
                placeId: acc.placeId,
                category: acc.category,
                address: acc.address,
                location: acc.location,
                types: acc.types,
                website: acc.website,
                phoneNumber: acc.phoneNumber,
              }))}
              value={selectedAccommodation}
              onChange={handleAccommodationChange}
              inputValue={inputValue}
              onInputChange={(newValue, { action }) => {
                if (action === "input-change") {
                  setInputValue(newValue);
                  setName(newValue);
                }
              }}
              placeholder="Select or Type Accommodation"
              isClearable
              isSearchable
              onCreateOption={(inputValue) => {
                const newSlug = `${slugify(inputValue)}-${uuidv4()}`; // Ensure uniqueness
                const newOption = {
                  value: newSlug,
                  label: inputValue,
                  placeId: null,
                  category: "custom",
                };
                setAvailableAccommodations([
                  ...availableAccommodations,
                  newOption,
                ]);
                setSelectedAccommodation(newOption);
                setName(inputValue);
                setInputValue(inputValue); // Sync inputValue with name
              }}
              formatOptionLabel={(option) => (
                <div>
                  <span>{option.label}</span>
                  {option.category && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({capitalizeWords(option.category.replace(/_/g, " "))})
                    </span>
                  )}
                  {option.rating && (
                    <span className="ml-2 text-sm text-yellow-500">
                      ⭐ {option.rating}
                    </span>
                  )}
                </div>
              )}
            />
            {checkingSlug && (
              <p className="text-sm text-gray-500">
                Checking slug availability...
              </p>
            )}
            {!isSlugUnique && (
              <p className="text-sm text-red-500">
                An accommodation with this slug already exists.
              </p>
            )}
          </div>

          {/* **Slug Display (Read-Only)** */}
          <div>
            <label className="block mb-2 font-semibold">Slug</label>
            <input
              type="text"
              value={slugify(name)}
              readOnly
              className="p-2 border rounded w-full bg-gray-100"
            />
          </div>

          {/* **"Is in Park?" Toggle** */}
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

          {/* **Concession Fee Category Selection** */}
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

          {/* **Concession Fees Form** */}
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
                      handleConcessionFeeChange(
                        index,
                        "category",
                        e.target.value
                      )
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

          {/* **Facilities (Amenities) Selection** */}
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
              ]}
              value={amenities.map((f) => ({
                value: f,
                label: capitalizeWords(f.replace(/_/g, " ")),
              }))}
              onChange={(selectedOptions) =>
                setAmenities(selectedOptions.map((option) => option.value))
              }
              placeholder="Select Facilities"
              isClearable
            />
          </div>

          {/* **Description** */}
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

          {/* **Website** */}
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

          {/* **Phone** */}
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

          {/* **Level Category** */}
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

          {/* **Zone Selection** */}
          <div>
            <label className="block mb-2 font-semibold">Zone</label>
            <Select
              options={[
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

          {/* **Status Selection** */}
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

          {/* **Accommodation Prices** */}
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
                {pricing[season.key]?.categories?.length > 0 ? (
                  pricing[season.key].categories.map((category, index) => (
                    <div
                      key={`${season.key}-${index}`}
                      className="border p-2 rounded mb-2"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        {/* **Charge Category Selection** */}
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

                        {/* **Rack Price Input** */}
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
                            required
                          />
                        </div>

                        {/* **STO Price Input** */}
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
                            required
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
                  ))
                ) : (
                  <p className="text-gray-500">
                    No pricing categories available.
                  </p>
                )}
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

          {/* **Image Upload and Cropping** */}
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

          {/* **SEO Generation** */}
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
              <label className="block mb-1 font-semibold">
                SEO Description
              </label>
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                placeholder="SEO Description"
                className="p-2 border rounded w-full"
                rows={4}
              ></textarea>
            </div>
          </div>

          {/* **Submit Button** */}
          <div>
            <button
              type="submit"
              disabled={!isSlugUnique || checkingSlug || isSubmitting}
              className={`bg-blue-600 text-white p-3 rounded w-full mt-6 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-semibold ${
                (!isSlugUnique || checkingSlug || isSubmitting) &&
                "opacity-50 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update Accommodation"}
            </button>
          </div>

          {/* **Image Cropper Modal** */}
          {cropModalOpen && currentImageFile && (
            <ImageCropper
              imgUrl={currentImageFile}
              aspectRatio={1} // 1:1 aspect ratio for square images
              onCropComplete={handleCropComplete}
              onCancel={handleCancelCrop}
            />
          )}

          {/* **Loading Indicator for Place Details** */}
          {loadingPlaceDetails && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <p>Loading accommodation details...</p>
              </div>
            </div>
          )}
        </form>
      )}
    </>
  );
};

EditAccommodationForm.propTypes = {
  slug: PropTypes.string.isRequired, // Slug of the accommodation to edit
  onSuccess: PropTypes.func, // Optional callback after successful update
};

export default EditAccommodationForm;
