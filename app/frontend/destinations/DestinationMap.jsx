// components/frontend/destinations/DestinationMap.jsx

"use client";

import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";
import { Spinner, Alert } from "react-bootstrap";
import L from "leaflet";

// Fixing the default marker icon issue in Leaflet when using with React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

/**
 * Component to fit the map bounds to the polygon
 */
const FitBounds = ({ boundary }) => {
  const map = useMap();

  useEffect(() => {
    if (boundary && boundary.length > 0) {
      const leafletBoundary = boundary.map((coord) => [coord[0], coord[1]]);
      const bounds = L.latLngBounds(leafletBoundary);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [boundary, map]);

  return null;
};

/**
 * DestinationMap Component
 *
 * @param {Object} props - Component props
 * @param {string} props.destinationName - Name of the destination to display on the map
 * @param {Array<Array<number>>} props.boundary - Array of [latitude, longitude] pairs defining the boundary
 * @returns {JSX.Element} - Rendered OpenStreetMap map with boundary
 */
const DestinationMap = ({ destinationName, boundary }) => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch coordinates using Nominatim API (if not using Firestore's latitude and longitude)
  const fetchCoordinates = async (name) => {
    const encodedName = encodeURIComponent(name);
    const geocodingUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedName}`;

    try {
      const response = await fetch(geocodingUrl, {
        headers: {
          "User-Agent": "YourAppName/1.0", // Replace with your app name and version
          "Accept-Language": "en",
        },
      });

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setCoordinates({
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          display_name,
        });
      } else {
        throw new Error("No results found for the destination.");
      }
    } catch (err) {
      console.error("Error fetching coordinates:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (destinationName) {
      fetchCoordinates(destinationName);
    }
  }, [destinationName]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  if (!coordinates) {
    return null; // Or handle as needed
  }

  // If boundary is provided, ensure it is in [lat, lng] format
  const formattedBoundary =
    boundary && boundary.length > 0
      ? boundary.map((coord) => [coord[0], coord[1]])
      : [];

  return (
    <div className="destination-map mb-5 rounded-12">
      <MapContainer
        center={[coordinates.lat, coordinates.lon]}
        zoom={8}
        scrollWheelZoom={false}
        style={{ height: "300px", width: "100%" }}
        className="rounded-12"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[coordinates.lat, coordinates.lon]}>
          <Popup>
            <strong>{destinationName}</strong>
          </Popup>
        </Marker>
        {formattedBoundary.length > 0 && (
          <>
            <Polygon
              positions={formattedBoundary}
              pathOptions={{
                color: "red",
                weight: 3,
                fillColor: "red",
                fillOpacity: 0.2,
              }}
            />
            <FitBounds boundary={formattedBoundary} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default DestinationMap;
