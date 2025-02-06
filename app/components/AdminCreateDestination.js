// app/components/Admin/AdminCreateDestination.js
"use client";
import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { db } from "@/app/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const AdminCreateDestination = ({ userClaims }) => {
  const [destination, setDestination] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [accommodations, setAccommodations] = useState([]);
  const googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY";

  // Check if the user has the admin role
  const isAdmin = userClaims && userClaims.role === "admin";

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey,
    libraries: ["places"],
  });

  if (!isAdmin) {
    return <p className="text-red-500">Access Denied: Only admin users can create destinations.</p>;
  }

  const handleDestinationSelect = async (destination) => {
    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
        params: {
          address: destination,
          key: googleMapsApiKey,
        },
      });
      const location = response.data.results[0].geometry.location;
      setCoordinates(location);
      setDestination(destination);

      // Fetch nearby accommodations
      fetchAccommodations(location);
    } catch (error) {
      toast.error("Error fetching destination coordinates.");
    }
  };

  const fetchAccommodations = async (location) => {
    try {
      const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
        params: {
          location: `${location.lat},${location.lng}`,
          radius: 50000,
          type: "lodging",
          key: googleMapsApiKey,
        },
      });
      setAccommodations(response.data.results);
    } catch (error) {
      toast.error("Error fetching accommodations.");
    }
  };

  const handleSubmitDestination = async () => {
    if (!destination || !coordinates) {
      toast.error("Please set a destination and coordinates.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "destinations"), {
        name: destination,
        coordinates,
        seoMetadata: {
          title: `Explore ${destination} - Hotels and Tours`,
          metaDescription: `Discover ${destination} and nearby accommodations for an unforgettable experience.`,
          keywords: `${destination}, hotels, national park, tours`,
        },
      });
      toast.success("Destination added successfully!");

      // Save accommodations separately, each with a reference to this destination
      accommodations.forEach(async (place) => {
        await addDoc(collection(db, "accommodations"), {
          destinationId: docRef.id,
          name: place.name,
          address: place.vicinity,
          coordinates: place.geometry.location,
          seoMetadata: {
            title: `Stay at ${place.name} in ${destination}`,
            metaDescription: `${place.name} offers comfort and luxury near ${destination}.`,
            keywords: `${place.name}, ${destination}, hotel, lodging`,
          },
        });
      });
    } catch (error) {
      toast.error("Error adding destination or accommodations.");
    }
  };

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create Destination</h2>

      <label className="block mb-2">Destination</label>
      <input
        type="text"
        placeholder="Enter a destination (e.g., Serengeti National Park)"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="p-2 border rounded w-full mb-4"
      />
      <button
        onClick={() => handleDestinationSelect(destination)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Search Destination
      </button>

      {coordinates && (
        <GoogleMap
          center={coordinates}
          zoom={10}
          mapContainerStyle={{ height: "400px", width: "100%" }}
        >
          <Marker position={coordinates} />
        </GoogleMap>
      )}

      {accommodations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-6">Nearby Accommodations</h3>
          <ul>
            {accommodations.map((place) => (
              <li key={place.place_id} className="mt-2">
                {place.name} - {place.vicinity}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={handleSubmitDestination}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
      >
        Save Destination and Accommodations
      </button>
    </div>
  );
};

export default AdminCreateDestination;
