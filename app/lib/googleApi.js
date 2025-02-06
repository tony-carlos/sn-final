// app/lib/googleApi.js
import axios from "axios";

export const geocodeAddress = async (address) => {
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address,
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    });
    return response.data.results[0].geometry.location; // { lat, lng }
  } catch (error) {
    console.error("Geocoding error:", error);
    throw error;
  }
};

export const getNearbyAccommodations = async (location) => {
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
      params: {
        location: `${location.lat},${location.lng}`,
        radius: 5000, // Radius in meters
        type: "lodging",
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    });
    return response.data.results; // List of nearby accommodations
  } catch (error) {
    console.error("Places API error:", error);
    throw error;
  }
};
