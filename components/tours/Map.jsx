// components/Map.jsx

'use client'; // Ensures client-side rendering in Next.js

import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/system';

// Fix Leaflet's default icon paths for Next.js
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

// Styled component for the map container with responsive styles
const StyledMapBox = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(1), // Rounded corners
  border: '1px solid #e0e0e0', // Light gray border
  overflow: 'hidden', // Ensure content doesn't spill out
  height: '500px', // Default height
  width: '100%', // Full width
    
  [theme.breakpoints.down('sm')]: {
    height: '300px', // Reduced height on small screens
    border: '1px solid #ccc', // Slightly darker border
  },
}));

/**
 * Component to adjust the map's view to fit all markers.
 */
const FitBounds = ({ positions }) => {
  const map = useMap();

  React.useEffect(() => {
    if (positions.length === 0) return;

    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [positions, map]);

  return null;
};

/**
 * MapComponent displays 'Start', 'End', and itinerary markers on the map,
 * along with a polyline connecting them to visualize the tour route.
 *
 * @param {Object} props
 * @param {Object} props.tour - The tour object containing 'from', 'ends', and 'itinerary' information.
 */
const Map = ({ tour }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Extract 'from' and 'ends' from the tour data
  const from = tour.basicInfo.from
    ? {
        lat: tour.basicInfo.from.coordinates.lat,
        lng: tour.basicInfo.from.coordinates.lng,
        label: 'Start',
      }
    : null;

  const ends = tour.basicInfo.ends
    ? {
        lat: tour.basicInfo.ends.coordinates.lat,
        lng: tour.basicInfo.ends.coordinates.lng,
        label: 'End',
      }
    : null;

  // Extract itinerary destinations
  const itineraryDestinations = tour.itinerary
    .filter(
      (item) =>
        item.destination &&
        item.destination.coordinates &&
        typeof item.destination.coordinates.lat === 'number' &&
        typeof item.destination.coordinates.lng === 'number'
    )
    .map((item, index) => ({
      destinationName: item.destination.name,
      lat: item.destination.coordinates.lat,
      lng: item.destination.coordinates.lng,
      day: index + 1, // Calculate day number based on index
    }));

  // Collect all positions in order: Start -> Itinerary Destinations -> End
  const orderedPositions = [];
  if (from) orderedPositions.push([from.lat, from.lng]);
  itineraryDestinations.forEach((dest) => {
    orderedPositions.push([dest.lat, dest.lng]);
  });
  if (ends) orderedPositions.push([ends.lat, ends.lng]);

  // Determine the center of the map
  const center =
    orderedPositions.length > 0
      ? [
          orderedPositions.reduce((sum, pos) => sum + pos[0], 0) /
            orderedPositions.length,
          orderedPositions.reduce((sum, pos) => sum + pos[1], 0) /
            orderedPositions.length,
        ]
      : [0, 0];

  const zoom = isSmallScreen ? 4 : 5; // Adjust zoom based on screen size

  return (
    <StyledMapBox>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Start Marker */}
        {from && (
          <Marker position={[from.lat, from.lng]}>
            <Tooltip
              direction={isSmallScreen ? "bottom" : "right"}
              offset={[-20, 0]} // Push tooltip accordingly
              opacity={1}
              permanent
              className="bg-white text-black border border-gray-300 rounded px-2 py-1 shadow-lg text-xs font-semibold"
            >
              {from.label}
            </Tooltip>
          </Marker>
        )}

        {/* Itinerary Markers */}
        {itineraryDestinations.map((dest, index) => (
          <Marker key={`itinerary-${index}`} position={[dest.lat, dest.lng]}>
            <Tooltip
              direction={isSmallScreen ? "bottom" : "left"}
              offset={[-20, 0]} // Push tooltip accordingly
              opacity={1}
              permanent
              className="bg-white text-black border border-gray-300 rounded px-2 py-1 shadow-lg text-xs font-semibold"
            >
              Day {dest.day}
            </Tooltip>
          </Marker>
        ))}

        {/* End Marker */}
        {ends && (
          <Marker position={[ends.lat, ends.lng]}>
            <Tooltip
              direction={isSmallScreen ? "bottom" : "right"}
              offset={[-20, 0]} // Push tooltip accordingly
              opacity={1}
              permanent
              className="bg-white text-green border border-gray-300 rounded px-2 py-1 shadow-lg text-xs font-semibold"
            >
              {ends.label}
            </Tooltip>
          </Marker>
        )}

        {/* Polyline */}
        {orderedPositions.length > 1 && (
          <Polyline
            positions={orderedPositions}
            color="#3388ff"
            weight={3}
            opacity={0.8}
            dashArray="5, 10"
          />
        )}

        <FitBounds positions={orderedPositions} />
      </MapContainer>
    </StyledMapBox>
  );
};

export default Map;
