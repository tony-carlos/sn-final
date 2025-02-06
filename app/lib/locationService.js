// app/lib/locationService.js
import axios from "axios";

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

export const searchCountry = async (country) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        q: country,
        format: "json",
        addressdetails: 1,
        limit: 1,
      },
      headers: {
        "User-Agent": "YourAppName - your.email@example.com", // Add your app name and contact for OpenStreetMap usage
      },
    });
    console.log("Country data:", response.data); // Log the response
    return response.data[0];
  } catch (error) {
    console.error("Error fetching country data:", error);
    throw error;
  }
};

export const searchRegion = async (country, state) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        country,
        state,
        format: "json",
        addressdetails: 1,
        limit: 5,
      },
      headers: {
        "User-Agent": "YourAppName - your.email@example.com",
      },
    });
    console.log("Region data:", response.data); // Log the response
    return response.data;
  } catch (error) {
    console.error("Error fetching region data:", error);
    throw error;
  }
};

export const searchDistrict = async (country, state, city) => {
  try {
    const response = await axios.get(`${NOMINATIM_BASE_URL}/search`, {
      params: {
        country,
        state,
        city,
        format: "json",
        addressdetails: 1,
        limit: 5,
      },
      headers: {
        "User-Agent": "YourAppName - your.email@example.com",
      },
    });
    console.log("District data:", response.data); // Log the response
    return response.data;
  } catch (error) {
    console.error("Error fetching district data:", error);
    throw error;
  }
};
