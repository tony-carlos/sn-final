// app/components/hooks/useTravelGuide.js

"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Custom hook to fetch a single Travel Guide by slug from Firestore.
 *
 * @returns {Object} - Contains guide, loading, and error states.
 */
const useTravelGuide = () => {
  const params = useParams();
  const { slug } = params;

  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        setLoading(true);
        const guidesRef = collection(db, "safariguide");
        const q = query(guidesRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError(true);
          notFound(); // Triggers Next.js's 404 page
        } else {
          const guideData = querySnapshot.docs[0].data();
          console.log("Fetched Guide:", guideData); // Debugging log
          setGuide(guideData);
        }
      } catch (err) {
        console.error("Error fetching Safari Guide:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchGuide();
    }
  }, [slug]);

  return { guide, loading, error };
};

export default useTravelGuide;
