// hooks/useTravelGuides.jsx
"use client";

import { useState, useEffect } from 'react';
import { db } from "@/app/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

const useTravelGuides = () => {
  const [travelGuides, setTravelGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTravelGuides = async () => {
      try {
        const guidesCollection = collection(db, "travelGuides");
        const guidesSnapshot = await getDocs(guidesCollection);
        const guidesList = guidesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTravelGuides(guidesList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTravelGuides();
  }, []);

  return { travelGuides, loading, error };
};

export default useTravelGuides;