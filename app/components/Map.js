// app/components/Map.js
"use client";
import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const Map = ({ center, markers }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={{ height: "400px", width: "100%" }} center={center} zoom={10}>
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
