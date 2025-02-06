"use client";

import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase"; // Adjust path to your firebase config
import { collection, getDocs } from "firebase/firestore";

/**
 * Custom hook to fetch all destinations from Firestore.
 * Assumes a "destinations" collection where each doc has a `title`.
 *
 * @returns {Object} - { destinations, loading, error }
 */
export const useDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        setError(null);

        const querySnapshot = await getDocs(collection(db, "destinations"));
        console.log(`Fetched ${querySnapshot.size} destinations`);

        const fetchedDestinations = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          // Assuming each document has at least { title: string }
          fetchedDestinations.push({
            id: doc.id,
            title: data.title || "Unknown Destination",
            ...data,
          });
        });

        setDestinations(fetchedDestinations);
      } catch (err) {
        console.error("Error fetching destinations:", err);
        setError("Failed to fetch destinations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return { destinations, loading, error };
};
