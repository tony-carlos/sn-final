// app/components/MapComponent.jsx
'use client';
import dynamic from "next/dynamic";

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom Hook to Fit Map Bounds
const FitBounds = ({ from, ends, itineraryRoutes }) => {
  const map = useMap();

  useEffect(() => {
    const bounds = [];

    if (from) {
      bounds.push([from.lat, from.lng]);
    }
    if (ends) {
      bounds.push([ends.lat, ends.lng]);
    }
    if (itineraryRoutes) {
      itineraryRoutes.forEach((route) => {
        route.coordinates.forEach((coord) => {
          bounds.push([coord.lat, coord.lng]);
        });
      });
    }

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [from, ends, itineraryRoutes, map]);

  return null;
};

const MapComponent = ({ from, ends, itineraryRoutes }) => {
  // Default center if no data is provided
  const defaultCenter = [0, 0];
  const defaultZoom = 2;

  return (
    <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: '500px', width: '100%' }}>
      {/* OpenStreetMap Tile Layer */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Markers for 'From' and 'Ends' */}
      {from && (
        <Marker position={[from.lat, from.lng]}>
          <Popup>
            <strong>From:</strong> {from.label}
          </Popup>
        </Marker>
      )}

      {ends && (
        <Marker position={[ends.lat, ends.lng]}>
          <Popup>
            <strong>Ends:</strong> {ends.label}
          </Popup>
        </Marker>
      )}

      {/* Polylines for Itinerary Routes */}
      {itineraryRoutes &&
        itineraryRoutes.map((route, index) => (
          <Polyline
            key={index}
            positions={route.coordinates.map((coord) => [coord.lat, coord.lng])}
            color={route.color || 'blue'}
          >
            <Popup>
              <strong>Route {index + 1}:</strong> {route.description || 'No Description'}
            </Popup>
          </Polyline>
        ))}

      {/* Fit Map Bounds */}
      <FitBounds from={from} ends={ends} itineraryRoutes={itineraryRoutes} />
    </MapContainer>
  );
};

// PropTypes for type checking
MapComponent.propTypes = {
  from: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }),
  ends: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
  }),
  itineraryRoutes: PropTypes.arrayOf(
    PropTypes.shape({
      coordinates: PropTypes.arrayOf(
        PropTypes.shape({
          lat: PropTypes.number.isRequired,
          lng: PropTypes.number.isRequired,
        })
      ).isRequired,
      color: PropTypes.string, // Optional: to customize route color
      description: PropTypes.string, // Optional: to describe the route
    })
  ),
};

export default MapComponent;
