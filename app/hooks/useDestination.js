// hooks/useDestination.js

import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase"; // Ensure the path is correct
import { collection, query, where, onSnapshot } from "firebase/firestore";

/**
 * Custom hook to fetch a single destination from Firebase Firestore based on slug.
 *
 * @param {string} slug - The slug of the destination to fetch.
 * @returns {Object} - Contains destination object, isLoading boolean, and error message.
 */
const useDestination = (slug) => {
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setError("No slug provided.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const destinationsRef = collection(db, "destinations");
    const q = query(destinationsRef, where("slug", "==", slug));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          setDestination(null);
        } else {
          const doc = snapshot.docs[0];
          const docData = doc.data();
          setDestination({
            id: doc.id,
            title: docData.title, // Updated from title to title
            overview: docData.overview,
            climate: docData.climate,
            gettingThere: docData.gettingThere,
            images: docData.images,
            slug: docData.slug,
            type: docData.type,
            zone: docData.zone,
            whenToVisit: docData.whenToVisit,
            activities: docData.activities || [],
            commonAnimals: docData.commonAnimals || [],
            attractions: docData.attractions || [],
            featureCards: docData.featureCards || [],
            youtubeLink: docData.youtubeLink,
            seo: docData.seo,
            status: docData.status,
            boundary: docData.boundary || [], // Ensure boundary is included if available
          });
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching destination from Firebase:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [slug]);

  return { destination, isLoading, error };
};

export default useDestination;
