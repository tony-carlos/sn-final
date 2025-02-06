"use client";

import React, { useState, useRef, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import { db, storage } from "@/app/lib/firebase";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import ImageCropper from "@/components/ImageCropper"; // Ensure this is a Client Component
import dynamic from "next/dynamic";

const ConfirmDeleteToast = dynamic(
  () => import("@/components/ConfirmDeleteToast"),
  { ssr: false }
);

const libraries = ["places"];

const activitiesOptions = [
  { value: "safari", label: "Safari" },
  { value: "hiking", label: "Hiking" },
  { value: "bird_watching", label: "Bird Watching" },
  { value: "museum_tour", label: "Museum Tour" },
  { value: "hot_balloon", label: "Hot Balloon" },
  { value: "nature_walks", label: "Nature Walks" },
  { value: "wildebeest_migration", label: "Wildebeest Migration" },
  { value: "filming", label: "Filming" },
  { value: "camping_safaris", label: "Camping Safaris" },
  { value: "horse_riding", label: "Horse Riding" },
  { value: "biking", label: "Biking" },
  { value: "canoeing", label: "Canoeing" },
  { value: "sundowning", label: "Sundowning" },
  { value: "bush_dining", label: "Bush Dining" },
  { value: "game_drive", label: "Game Drive" },
  { value: "walking_safaris", label: "Walking Safaris" },
  { value: "archaeological_tours", label: "Archaeological Tours" },
  { value: "cultural_tours", label: "Cultural Tours" },
  { value: "guided_nature_walk", label: "Guided Nature Walk" },
  { value: "botanical_tours", label: "Botanical Tours" },
  { value: "photographic_safaris", label: "Photographic Safaris" },
  { value: "night_game_drives", label: "Night Game Drives" },
];

const zoneOptions = [
  { value: "northern_zone", label: "Northern Zone" },
  { value: "southern_zone", label: "Southern Zone" },
  { value: "western_zone", label: "Western Zone" },
  { value: "eastern_zone", label: "Eastern Zone" },
];

const pricingCategoryOptions = [
  { value: "entrance", label: "Entrance" },
  { value: "guide", label: "Guide/Ranger" },
  { value: "Consession Fee", label: "Consession Fee" },
  { value: "Crater Fee", label: "Crater Fee" },
];

const typeOptions = [
  { value: "national_park", label: "National Park" },
  { value: "conservation_area", label: "Conservation Area" },
  { value: "museum", label: "Museum" },
  { value: "cultural", label: "Cultural Area" },
  { value: "Town", label: "Town" },
  { value: "Airport", label: "Airport" },
];

const CreateDestinationForm = ({ destinationId = null }) => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
    }
  }, []);

  const [title, settitle] = useState("");
  const [slug, setSlug] = useState("");
  const [overview, setOverview] = useState("");
  const [climate, setClimate] = useState("");
  const [gettingThere, setGettingThere] = useState("");
  const [activities, setActivities] = useState([]);
  const [zone, setZone] = useState(null);
  const [pricing, setPricing] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [commonAnimals, setCommonAnimals] = useState([]);
  const [whenToVisit, setWhenToVisit] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [type, setType] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [status, setStatus] = useState("Draft");
  const [coordinates, setCoordinates] = useState(null);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [newPrice, setNewPrice] = useState({
    name: "",
    category: "",
    cost: "",
  });
  const autocompleteRef = useRef(null);
  const router = useRouter();

  // Cropping and uploading state variables
  const [croppingImage, setCroppingImage] = useState(null);
  const [cropAspectRatio, setCropAspectRatio] = useState(1);

  // Separate uploading states
  const [uploadingDestinationImages, setUploadingDestinationImages] = useState(
    []
  );
  const [uploadingAttractionImages, setUploadingAttractionImages] = useState(
    []
  );
  const [uploadingAnimalImages, setUploadingAnimalImages] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent double submission

  // Function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word characters
      .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with -
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing -
  };

  // Effect to auto-generate slug when title changes
  useEffect(() => {
    const newSlug = generateSlug(title);
    setSlug(newSlug);
  }, [title]);

  // Optional: Function to check slug uniqueness
  const checkSlugUnique = async (currentSlug) => {
    const destinationsRef = collection(db, "destinations");
    const q = query(destinationsRef, where("slug", "==", currentSlug));
    const querySnapshot = await getDocs(q);
    if (!destinationId && !querySnapshot.empty) {
      return false; // Slug already exists
    }
    if (destinationId && querySnapshot.size > 1) {
      // More than one document with the same slug
      return false;
    }
    return true;
  };

  const handleAddPricing = () => {
    if (!newPrice.name || !newPrice.category || !newPrice.cost) {
      toast.error("Please fill in all pricing fields.");
      return;
    }
    setPricing([...pricing, newPrice]);
    setNewPrice({ name: "", category: "", cost: "" });
    setShowPricingModal(false);
    toast.success("Price added successfully!");
  };

  const handleRemovePrice = (index) => {
    setPricing((prev) => prev.filter((_, i) => i !== index));
    toast.success("Price removed successfully!");
  };

  const handleRemoveImage = async (index, setFunc, imagesArray) => {
    const imageToRemove = imagesArray[index];
    if (imageToRemove && imageToRemove.storagePath) {
      // Delete image from Firebase Storage
      const imageRef = ref(storage, imageToRemove.storagePath);
      await deleteObject(imageRef);
    }
    setFunc((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed successfully!");
  };

  const uploadImageToStorage = async (file, fileName, progressCallback) => {
    const uniqueImageName = `${uuidv4()}-${fileName}`;
    const storagePath = `images/${uniqueImageName}`;
    const storageRef = ref(storage, storagePath);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // progress callback
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progressCallback) {
            progressCallback(progress);
          }
        },
        (error) => {
          console.error("Image upload error:", error);
          toast.error("Failed to upload image.");
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ downloadURL, storagePath });
        }
      );
    });
  };

  const handleImageSelect = (e, setFunc, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCroppingImage({
        imgSrc: reader.result,
        setFunc,
        index,
        fileName: file.name,
      });

      // Now all three sets use 1200×700
      if (
        setFunc === setSelectedImages ||
        setFunc === setAttractions ||
        setFunc === setCommonAnimals
      ) {
        setCropAspectRatio(1200 / 700); // 1200×700 aspect ratio
      } else {
        setCropAspectRatio(null); // or any other ratio you prefer
      }
    };

    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedFile) => {
    const { setFunc, index, fileName } = croppingImage;
    const uploadId = uuidv4();

    // Determine which uploading images state to use
    let setUploadingImagesFunc;
    if (setFunc === setSelectedImages) {
      setUploadingImagesFunc = setUploadingDestinationImages;
    } else if (setFunc === setAttractions) {
      setUploadingImagesFunc = setUploadingAttractionImages;
    } else if (setFunc === setCommonAnimals) {
      setUploadingImagesFunc = setUploadingAnimalImages;
    }

    // Add the image to uploadingImages
    if (setUploadingImagesFunc) {
      setUploadingImagesFunc((prev) => [
        ...prev,
        { id: uploadId, fileName, progress: 0 },
      ]);
    }

    try {
      const { downloadURL, storagePath } = await uploadImageToStorage(
        croppedFile,
        fileName,
        (progress) => {
          // Update progress
          if (setUploadingImagesFunc) {
            setUploadingImagesFunc((prev) =>
              prev.map((img) =>
                img.id === uploadId ? { ...img, progress } : img
              )
            );
          }
        }
      );

      // Remove from uploadingImages
      if (setUploadingImagesFunc) {
        setUploadingImagesFunc((prev) =>
          prev.filter((img) => img.id !== uploadId)
        );
      }

      // Add to selectedImages or other relevant state
      if (setFunc === setSelectedImages) {
        setFunc((prev) => [...prev, { url: downloadURL, storagePath }]);
        toast.success("Image uploaded successfully!");
      } else if (setFunc === setAttractions) {
        const updatedAttractions = [...attractions];
        if (index !== null) {
          updatedAttractions[index] = {
            ...updatedAttractions[index],
            image: downloadURL,
            storagePath,
          };
        }
        setAttractions(updatedAttractions);
        toast.success("Attraction image uploaded successfully!");
      } else if (setFunc === setCommonAnimals) {
        const updatedAnimals = [...commonAnimals];
        if (index !== null) {
          updatedAnimals[index] = {
            ...updatedAnimals[index],
            image: downloadURL,
            storagePath,
          };
        }
        setCommonAnimals(updatedAnimals);
        toast.success("Animal image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // Remove from uploadingImages in case of error
      if (setUploadingImagesFunc) {
        setUploadingImagesFunc((prev) =>
          prev.filter((img) => img.id !== uploadId)
        );
      }
    }
    setCroppingImage(null);
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setCoordinates({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        settitle(place.name || "");
      }
    }
  };

  /* SEO Generation */
  const handleSEOGeneration = () => {
    // 1) Rename local variable to avoid shadowing the state variable `title`.
    const generatedTitle = `Explore ${title} - Travel Guide`;

    // 2) Add meta keywords (simple example).
    // You could store these in state if desired.
    const metaKeywords =
      activities.map((a) => a.label).join(", ") +
      (zone?.label ? `, ${zone.label}` : "") +
      ", travel, tourism";

    const description = `${title} offers experiences like ${activities
      .map((a) => a.label)
      .join(", ")}. Discover the beauty of ${
      zone?.label
    } with highlights such as ${overview
      .replace(/<\/?[^>]+(>|$)/g, "")
      .substring(0, 150)}... Plan your visit today!`;

    setSeoTitle(generatedTitle);
    setSeoDescription(description);

    toast.success(
      `SEO title, description, and keywords generated!\n\nKeywords: ${metaKeywords}`
    );
  };
  /* End SEO Generation */

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);

    // Validate required fields
    if (!title || !slug || !overview || !type || selectedImages.length === 0) {
      toast.error(
        "Please fill in all required fields, ensure slug is generated, and upload at least one image."
      );
      setIsSubmitting(false);
      return;
    }

    if (
      uploadingDestinationImages.length > 0 ||
      uploadingAttractionImages.length > 0 ||
      uploadingAnimalImages.length > 0
    ) {
      toast.error("Please wait for images to finish uploading.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if slug is unique
      const isUnique = await checkSlugUnique(slug);
      if (!isUnique) {
        toast.error("The slug is already in use. Please modify it.");
        setIsSubmitting(false);
        return;
      }

      // Check if a destination with the same title already exists
      const destinationsRef = collection(db, "destinations");
      const q = query(destinationsRef, where("title", "==", title));
      const querySnapshot = await getDocs(q);

      if (!destinationId && !querySnapshot.empty) {
        toast.error("A destination with this title already exists.");
        setIsSubmitting(false);
        return;
      }

      const formData = {
        title: title,
        slug, // Include slug in form data
        overview,
        climate,
        gettingThere,
        activities: activities.map((a) => a.value),
        zone: zone ? zone.value : null,
        pricing,
        attractions: attractions.map((attraction) => ({
          name: attraction.name,
          image: attraction.image || null,
          storagePath: attraction.storagePath || null,
        })),
        commonAnimals: commonAnimals.map((animal) => ({
          name: animal.name,
          image: animal.image || null,
          storagePath: animal.storagePath || null,
        })),
        whenToVisit,
        youtubeLink,
        type: type ? type.value : null,
        isFeatured,
        status,
        seo: { title: seoTitle, description: seoDescription },
        coordinates,
        images: selectedImages.map((img) => ({
          url: img.url,
          storagePath: img.storagePath,
        })),
        createdAt: new Date(),
      };

      if (destinationId) {
        await setDoc(doc(db, "destinations", destinationId), formData, {
          merge: true,
        });
        toast.success("Destination updated successfully!");
      } else {
        await addDoc(collection(db, "destinations"), formData);
        toast.success("Destination created successfully!");
      }
      router.push("/admin/destinations");
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Failed to save destination.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Destination Title */}
      <div>
        <label className="block mb-1">Destination Title*</label>
        <input
          type="text"
          placeholder="Destination Title"
          value={title}
          onChange={(e) => settitle(e.target.value)}
          className="p-2 border rounded w-full"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block mb-1">Slug*</label>
        <input
          type="text"
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(generateSlug(e.target.value))}
          className="p-2 border rounded w-full"
          required
        />
        <small className="text-gray-500">
          This will be used in the URL. It should be unique and lowercase.
        </small>
      </div>

      {/* Google Places Autocomplete */}
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
      >
        <Autocomplete
          onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input
            type="text"
            placeholder="Search for a destination"
            className="p-2 border rounded w-full"
          />
        </Autocomplete>
      </LoadScript>

      {/* Overview */}
      <div>
        <label className="block mb-1">Overview*</label>
        <CKEditor
          editor={ClassicEditor}
          data={overview}
          onChange={(event, editor) => setOverview(editor.getData())}
        />
      </div>

      {/* Climate and Getting There */}
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="w-full md:w-1/2">
          <label className="block mb-1">Climate</label>
          <CKEditor
            editor={ClassicEditor}
            data={climate}
            onChange={(event, editor) => setClimate(editor.getData())}
          />
        </div>
        <div className="w-full md:w-1/2">
          <label className="block mb-1">Getting There</label>
          <CKEditor
            editor={ClassicEditor}
            data={gettingThere}
            onChange={(event, editor) => setGettingThere(editor.getData())}
          />
        </div>
      </div>

      {/* When to Visit and YouTube Link */}
      <div className="flex flex-col md:flex-row md:space-x-4 mt-4">
        {/* When to Visit CKEditor */}
        <div className="w-full md:w-1/2">
          <label className="block mb-1">When to Visit</label>
          <CKEditor
            editor={ClassicEditor}
            data={whenToVisit}
            onChange={(event, editor) => setWhenToVisit(editor.getData())}
          />
        </div>

        {/* YouTube Link Input */}
        <div className="w-full md:w-1/2">
          <label className="block mb-1">YouTube Link</label>
          <input
            type="url"
            placeholder="Enter YouTube Video URL"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
            className="p-2 border rounded w-full"
          />
          <small className="text-gray-500">
            Paste the full YouTube URL to embed a video related to the
            destination.
          </small>
        </div>
      </div>

      {/* Activities and Zone */}
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="w-full md:w-1/2">
          <label className="block mb-1">Activities</label>
          <Select
            isMulti
            options={activitiesOptions}
            value={activities}
            onChange={setActivities}
            placeholder="Select activities"
          />
        </div>
        <div className="w-full md:w-1/2">
          <label className="block mb-1">Zone</label>
          <Select
            options={zoneOptions}
            value={zone}
            onChange={(selected) => setZone(selected)}
            placeholder="Select zone"
          />
        </div>
      </div>

      {/* Type */}
      <div className="w-full">
        <label className="block mb-1">Type</label>
        <Select
          options={typeOptions}
          value={type}
          onChange={(selected) => setType(selected)}
          placeholder="Select type"
          className="w-full"
        />
      </div>

      {/* Pricing */}
      <div>
        <h3 className="text-lg font-semibold">Pricing</h3>
        <button
          type="button"
          onClick={() => setShowPricingModal(true)}
          className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
        >
          + Add Price
        </button>
        {pricing.map((price, index) => (
          <div key={index} className="border p-2 mt-2 relative">
            <h4 className="font-medium">
              {price.name} - {price.category}
            </h4>
            <p>Cost: ${price.cost}</p>
            <button
              type="button"
              onClick={() => handleRemovePrice(index)}
              className="absolute top-2 right-2 text-red-500"
            >
              <BiTrash />
            </button>
          </div>
        ))}

        {/* Pricing Modal */}
        {showPricingModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
              <h3 className="text-xl mb-4">Add Pricing</h3>
              <input
                type="text"
                placeholder="Name"
                value={newPrice.name}
                onChange={(e) =>
                  setNewPrice({ ...newPrice, name: e.target.value })
                }
                className="p-2 border rounded w-full mb-2"
              />
              <Select
                options={pricingCategoryOptions}
                value={
                  pricingCategoryOptions.find(
                    (option) => option.value === newPrice.category
                  ) || null
                }
                onChange={(selected) =>
                  setNewPrice({ ...newPrice, category: selected.value })
                }
                placeholder="Select Category"
                className="w-full mb-2"
              />
              <input
                type="number"
                placeholder="Cost"
                value={newPrice.cost}
                onChange={(e) =>
                  setNewPrice({ ...newPrice, cost: e.target.value })
                }
                className="p-2 border rounded w-full mb-2"
                min="0"
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPricingModal(false)}
                  className="text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddPricing}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Destination Images */}
      <div>
        <h3 className="text-lg font-semibold">Destination Images</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageSelect(e, setSelectedImages)}
          className="mt-2"
        />

        {/* Display Uploading Destination Images with Progress */}
        {uploadingDestinationImages.length > 0 && (
          <div className="flex flex-wrap mt-2">
            {uploadingDestinationImages.map((img) => (
              <div key={img.id} className="relative m-2">
                <div className="w-24 h-20 bg-gray-200 flex items-center justify-center">
                  <span>{Math.round(img.progress)}%</span>
                </div>
                <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                  <span className="text-white">
                    {Math.round(img.progress)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Display Uploaded Images */}
        {selectedImages.length > 0 && (
          <div className="flex flex-wrap mt-2">
            {selectedImages.map((img, index) => (
              <div key={index} className="relative m-2">
                {img.url && (
                  <Image
                    src={img.url}
                    alt="Selected"
                    width={100}
                    height={80}
                    className="object-cover rounded"
                  />
                )}
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveImage(index, setSelectedImages, selectedImages)
                  }
                  className="text-red-500 absolute top-2 right-2"
                >
                  <BiTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attractions and Common Animals */}
      <div>
        <h3 className="text-lg font-semibold">Attractions & Common Animals</h3>
        <div className="flex flex-col md:flex-row md:space-x-4">
          {/* Attractions */}
          <div className="w-full md:w-1/2">
            <h4 className="font-medium">Attractions</h4>
            {attractions.map((attraction, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Attraction Name"
                  value={attraction.name}
                  onChange={(e) => {
                    const updatedAttractions = [...attractions];
                    updatedAttractions[index].name = e.target.value;
                    setAttractions(updatedAttractions);
                  }}
                  className="p-2 border rounded w-full"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageSelect(e, setAttractions, index)}
                  className="ml-2"
                />
                {attraction.image && (
                  <Image
                    src={attraction.image}
                    alt="Attraction Thumbnail"
                    width={100}
                    height={80}
                    className="object-cover ml-2"
                  />
                )}
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveImage(index, setAttractions, attractions)
                  }
                  className="text-red-500 ml-2"
                >
                  <BiTrash />
                </button>
              </div>
            ))}
            {/* Display Uploading Attraction Images with Progress */}
            {uploadingAttractionImages.length > 0 && (
              <div className="flex flex-wrap mt-2">
                {uploadingAttractionImages.map((img) => (
                  <div key={img.id} className="relative m-2">
                    <div className="w-24 h-20 bg-gray-200 flex items-center justify-center">
                      <span>{Math.round(img.progress)}%</span>
                    </div>
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                      <span className="text-white">
                        {Math.round(img.progress)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                setAttractions([...attractions, { name: "", image: null }])
              }
              className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
            >
              + Add Attraction
            </button>
          </div>

          {/* Common Animals */}
          <div className="w-full md:w-1/2">
            <h4 className="font-medium">Common Animals</h4>
            {commonAnimals.map((animal, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  placeholder="Animal Name"
                  value={animal.name}
                  onChange={(e) => {
                    const updatedAnimals = [...commonAnimals];
                    updatedAnimals[index].name = e.target.value;
                    setCommonAnimals(updatedAnimals);
                  }}
                  className="p-2 border rounded w-full"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageSelect(e, setCommonAnimals, index)
                  }
                  className="ml-2"
                />
                {animal.image && (
                  <Image
                    src={animal.image}
                    alt="Animal Thumbnail"
                    width={100}
                    height={80}
                    className="object-cover ml-2"
                  />
                )}
                <button
                  type="button"
                  onClick={() =>
                    handleRemoveImage(index, setCommonAnimals, commonAnimals)
                  }
                  className="text-red-500 ml-2"
                >
                  <BiTrash />
                </button>
              </div>
            ))}
            {/* Display Uploading Animal Images with Progress */}
            {uploadingAnimalImages.length > 0 && (
              <div className="flex flex-wrap mt-2">
                {uploadingAnimalImages.map((img) => (
                  <div key={img.id} className="relative m-2">
                    <div className="w-24 h-20 bg-gray-200 flex items-center justify-center">
                      <span>{Math.round(img.progress)}%</span>
                    </div>
                    <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
                      <span className="text-white">
                        {Math.round(img.progress)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                setCommonAnimals([...commonAnimals, { name: "", image: null }])
              }
              className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
            >
              + Add Animal
            </button>
          </div>
        </div>
      </div>

      {/* Image Cropper Modal */}
      {croppingImage && (
        <ImageCropper
          imgUrl={croppingImage.imgSrc}
          aspectRatio={cropAspectRatio}
          onCropComplete={handleCropComplete}
          onCancel={() => setCroppingImage(null)}
        />
      )}

      {/* SEO Generation */}
      <div>
        <button
          type="button"
          onClick={handleSEOGeneration}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Generate SEO Title and Description
        </button>
        <div>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="SEO Title"
            className="p-2 border rounded w-full mt-2"
          />
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="SEO Description"
            className="p-2 border rounded w-full mt-2"
          ></textarea>
        </div>
      </div>

      {/* Status and Featured */}
      <div className="flex items-center space-x-4">
        <label>Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Publish</option>
        </select>
      </div>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
        />
        <span>Is Featured</span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className={`bg-green-600 text-white p-2 rounded w-full ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={
          isSubmitting ||
          uploadingDestinationImages.length > 0 ||
          uploadingAttractionImages.length > 0 ||
          uploadingAnimalImages.length > 0
        }
      >
        {destinationId ? "Update" : "Save"} Destination
      </button>
    </form>
  );
};

export default CreateDestinationForm;
