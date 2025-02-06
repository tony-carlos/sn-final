"use client";

import { useTours } from "@/app/hooks/useTours";
import { useMemo } from "react";

/**
 * Custom hook to fetch related tours based on a destination's label.
 *
 * @param {string} destinationLabel - The label of the destination (e.g., "Serengeti National Park").
 * @returns {Object} - { relatedTours, loading, error }
 */
export const useRelatedTours = (destinationLabel) => {
  const { tours, loading, error } = useTours();

  const relatedTours = useMemo(() => {
    if (loading || error || !tours) {
      // If still loading or there's an error, don't process
      return [];
    }

    if (!destinationLabel) {
      console.log("No destinationLabel provided. Returning empty related tours.");
      return [];
    }

    // Filter tours where any itinerary item's destination label matches the selected destination label
    const filteredTours = tours.filter((tour) =>
      tour.itinerary.some(
        (itineraryItem) =>
          itineraryItem.destination?.label === destinationLabel
      )
    );

    console.log(
      `Found ${filteredTours.length} related tours for destinationLabel: ${destinationLabel}`
    );
    return filteredTours;
  }, [tours, destinationLabel, loading, error]);

  return { relatedTours, loading, error };
};
