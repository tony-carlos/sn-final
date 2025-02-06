// hooks/useDestinations.js (One-Time Fetch)

import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase"; // Ensure the path is correct
import { collection, getDocs } from "firebase/firestore";

const useDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const destinationsRef = collection(db, "destinations");
        const snapshot = await getDocs(destinationsRef);
        const fetchedDestinations = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            title: docData.title,
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
          };
        });

        setDestinations(fetchedDestinations);
      } catch (err) {
        console.error("Error fetching destinations from Firebase:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  return { destinations, isLoading, error };
};

export default useDestinations;
