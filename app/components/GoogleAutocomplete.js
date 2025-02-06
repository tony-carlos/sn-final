// components/GoogleAutocomplete.js

"use client";

import React, { useState, useRef, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import PropTypes from "prop-types";

const libraries = ["places"];

const GoogleAutocomplete = ({ onPlaceSelected, placeholder }) => {
  const [loaded, setLoaded] = useState(false);
  const autocompleteRef = useRef(null);

  const handleLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
    setLoaded(true);
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      onPlaceSelected(place);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <Autocomplete
        onLoad={handleLoad}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          type="text"
          placeholder={placeholder || "Enter address"}
          className="p-2 border rounded w-full"
        />
      </Autocomplete>
    </LoadScript>
  );
};

GoogleAutocomplete.propTypes = {
  onPlaceSelected: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

GoogleAutocomplete.defaultProps = {
  placeholder: "Enter address",
};

export default GoogleAutocomplete;
