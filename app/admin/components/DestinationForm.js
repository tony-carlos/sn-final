// app/admin/components/DestinationForm.js

"use client";
import React, { useState, useRef, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Select from "react-select";
import { db, storage } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import Image from "next/image";
import AdminLayout from "../components/AdminLayout";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import PropTypes from "prop-types";

const libraries = ["places"];

// ...define options arrays (activitiesOptions, zoneOptions, etc.)

const DestinationForm = ({ destinationId }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // State variables
  const [title, settitle] = useState("");
  const [overview, setOverview] = useState("");
  const [climate, setClimate] = useState("");
  const [gettingThere, setGettingThere] = useState("");
  const [activities, setActivities] = useState([]);
  const [zone, setZone] = useState(null);
  const [pricing, setPricing] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [commonAnimals, setCommonAnimals] = useState([]);
  const [whenToVisit, setWhenToVisit] = useState("");
  const [type, setType] = useState(null);
  const [isFeatured, setIsFeatured] = useState(false);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // Destination images
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

  // Cropping state variables
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageRef, setImageRef] = useState(null);
  const [fileName, setFileName] = useState("");
  const [setFunc, setSetFunc] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Fetch existing destination data
  useEffect(() => {
    if (!destinationId) {
      setError("Destination ID is missing.");
      setLoading(false);
      return;
    }

    const fetchDestination = async () => {
      try {
        const docRef = doc(db, "destinations", destinationId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          settitle(data.title || "");
          setOverview(data.overview || "");
          setClimate(data.climate || "");
          setGettingThere(data.gettingThere || "");
          setActivities(
            data.activities
              ? activitiesOptions.filter((option) =>
                  data.activities.includes(option.value)
                )
              : []
          );
          setZone(
            data.zone
              ? zoneOptions.find((option) => option.value === data.zone)
              : null
          );
          setPricing(data.pricing || []);
          setAttractions(data.attractions || []);
          setCommonAnimals(data.commonAnimals || []);
          setWhenToVisit(data.whenToVisit || "");
          setType(
            data.type
              ? typeOptions.find((option) => option.value === data.type)
              : null
          );
          setIsFeatured(data.isFeatured || false);
          setSeoTitle(data.seo?.title || "");
          setSeoDescription(data.seo?.description || "");
          setSelectedImages(data.images || []);
          setStatus(data.status || "Draft");
          setCoordinates(data.coordinates || null);
        } else {
          setError("Destination not found.");
          toast.error("Destination not found.");
          router.push("/admin/destinations");
        }
      } catch (error) {
        console.error("Error fetching destination:", error);
        setError("Failed to fetch destination data.");
        toast.error("Failed to fetch destination data.");
        router.push("/admin/destinations");
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [destinationId, router]);

  // ...rest of the DestinationForm functions (handleAddPricing, handleRemovePrice, etc.)

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!title || !overview || !type || selectedImages.length === 0) {
      toast.error(
        "Please fill in all required fields and upload at least one image."
      );
      return;
    }

    const formData = {
      title,
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
      type: type ? type.value : null,
      isFeatured,
      status,
      seo: { title: seoTitle, description: seoDescription },
      coordinates,
      images: selectedImages.map((img) => ({
        url: img.url,
        storagePath: img.storagePath,
      })),
      updatedAt: new Date(),
    };

    try {
      await setDoc(doc(db, "destinations", destinationId), formData, {
        merge: true,
      });
      toast.success("Destination updated successfully!");
      router.push("/admin/destinations");
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Failed to update destination.");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Edit Destination</h1>
          <p>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Edit Destination</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </AdminLayout>
    );
  }

  // JSX Structure
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Destination</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Destination Title */}
          <input
            type="text"
            placeholder="Destination Title"
            value={title}
            onChange={(e) => settitle(e.target.value)}
            className="p-2 border rounded w-full"
            required
          />

          {/* Google Places Autocomplete */}
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <Autocomplete
              onLoad={(ref) => (autocompleteRef.current = ref)}
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
          <label>Overview</label>
          <CKEditor
            editor={ClassicEditor}
            data={overview}
            onChange={(event, editor) => setOverview(editor.getData())}
          />

          {/* Climate and Getting There */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-1/2">
              <label>Climate</label>
              <CKEditor
                editor={ClassicEditor}
                data={climate}
                onChange={(event, editor) => setClimate(editor.getData())}
              />
            </div>
            <div className="w-full md:w-1/2">
              <label>Getting There</label>
              <CKEditor
                editor={ClassicEditor}
                data={gettingThere}
                onChange={(event, editor) => setGettingThere(editor.getData())}
              />
            </div>
          </div>

          {/* Activities and Zone */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="w-full md:w-1/2">
              <label>Activities</label>
              <Select
                isMulti
                options={activitiesOptions}
                value={activities}
                onChange={setActivities}
                placeholder="Select activities"
              />
            </div>
            <div className="w-full md:w-1/2">
              <label>Zone</label>
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
            <label>Type</label>
            <Select
              options={typeOptions}
              value={type}
              onChange={(selected) => setType(selected)}
              placeholder="Select type"
              className="w-full"
            />
          </div>

          {/* Pricing */}
          <h3>Pricing</h3>
          <button
            type="button"
            onClick={() => setShowPricingModal(true)}
            className="bg-blue-500 text-white px-2 py-1 rounded"
          >
            + Add Price
          </button>
          {pricing.map((price, index) => (
            <div key={index} className="border p-2 mt-2 relative">
              <h4>
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
                  value={pricingCategoryOptions.find(
                    (option) => option.value === newPrice.category
                  )}
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
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowPricingModal(false)}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPricing}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Destination Images */}
          <h3>Destination Images</h3>
          <input
            type="file"
            onChange={(e) => handleImageSelect(e, setSelectedImages)}
          />
          {selectedImages.length > 0 && (
            <div className="flex flex-wrap">
              {selectedImages.map((img, index) => (
                <div key={index} className="relative m-2">
                  {img.url && (
                    <Image
                      src={img.url}
                      alt="Selected"
                      width={100}
                      height={100}
                      className="object-cover rounded"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveImage(
                        index,
                        setSelectedImages,
                        selectedImages
                      )
                    }
                    className="text-red-500 absolute top-2 right-2"
                  >
                    <BiTrash />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Attractions and Common Animals */}
          <h3>Attractions & Common Animals</h3>
          <div className="flex flex-col md:flex-row md:space-x-4">
            {/* Attractions */}
            <div className="w-full md:w-1/2">
              <h4>Attractions</h4>
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
                    onChange={(e) =>
                      handleImageSelect(e, setAttractions, index)
                    }
                    className="ml-2"
                  />
                  {attraction.image && (
                    <Image
                      src={attraction.image}
                      alt="Attraction Thumbnail"
                      width={100}
                      height={100}
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
              <h4>Common Animals</h4>
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
                      height={100}
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
              <button
                type="button"
                onClick={() =>
                  setCommonAnimals([
                    ...commonAnimals,
                    { name: "", image: null },
                  ])
                }
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
              >
                + Add Animal
              </button>
            </div>
          </div>

          {/* Cropping Modal */}
          {cropModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h3 className="text-xl mb-4">Crop Image</h3>
                <ReactCrop
                  src={imageToCrop}
                  crop={crop}
                  onImageLoaded={(image) => setImageRef(image)}
                  onChange={(newCrop) => setCrop(newCrop)}
                />
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setCropModalOpen(false)}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={getCroppedImg}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Crop
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SEO Generation */}
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
            className="bg-green-600 text-white p-2 rounded w-full"
          >
            Update Destination
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

DestinationForm.propTypes = {
  destinationId: PropTypes.string.isRequired,
};

export default DestinationForm;
