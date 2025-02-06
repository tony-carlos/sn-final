// app/lib/googlePlaces.js

import axios from "axios";

/**
 * Fetches nearby accommodations using Google Places API based on given coordinates.
 * Includes hotels, camps, tents, lodges, and other lodging types.
 * @param {number} lat - Latitude of the destination.
 * @param {number} lng - Longitude of the destination.
 * @param {string} apiKey - Google Maps API key.
 * @returns {Promise<Array>} - Returns a promise that resolves to an array of accommodations.
 */
export const fetchNearbyAccommodations = async (lat, lng, apiKey) => {
  try {
    console.log(`Fetching accommodations from Google Places API for lat=${lat}, lng=${lng}`);
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
      {
        params: {
          location: `${lat},${lng}`,
          radius: 10000, // 10 km radius
          type: "lodging", // Broad category
          keyword: "hotel,camp,lodge,tent", // Multiple types
          key: apiKey,
        },
      }
    );

    if (response.data.status !== "OK") {
      console.error(
        "Google Places API Error:",
        response.data.status,
        response.data.error_message
      );
      throw new Error(`Google Places API Error: ${response.data.status}`);
    }

    // Extract relevant accommodation information
    const accommodations = response.data.results.map((place) => ({
      value: place.place_id,
      label: place.name,
      address: place.vicinity,
      placeId: place.place_id,
      location: place.geometry.location, // { lat, lng }
      types: place.types, // Array of types
      rating: place.rating || null, // Optional: User rating
      userRatingsTotal: place.user_ratings_total || null, // Optional: Total user ratings
      photos: place.photos
        ? place.photos.map(
            (photo) =>
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
          )
        : [],
      // Note: 'website' and 'formatted_phone_number' are not available in Nearby Search API
      website: null,
      phoneNumber: null,
    }));

    console.log(`Parsed ${accommodations.length} accommodations from API response.`);
    return accommodations;
  } catch (error) {
    console.error("Error fetching accommodations from Google Places API:", error);
    throw error; // Propagate error to be handled by the API route
  }
};

/**
 * Alias for fetchNearbyAccommodations to maintain compatibility with existing imports.
 * This allows other modules to import fetchNearbyHotels without changing their import statements.
 */
export const fetchNearbyHotels = fetchNearbyAccommodations;

// If you have other exports, ensure they are exported below or alongside.