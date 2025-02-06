// hooks/useSafariguide.js

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

const useSafariguide = () => {
  const [safariguides, setSafariguides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSafariguides = async () => {
      try {
        console.log("Fetching Safariguides from Firestore...");
        const guidesRef = collection(db, "safariguide"); // Correct collection name
        const q = query(guidesRef, orderBy("createdAt", "desc")); // Sort by createdAt descending
        const querySnapshot = await getDocs(q);
        const guides = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Safariguides:", guides);
        setSafariguides(guides);
      } catch (err) {
        console.error("Error fetching safariguides:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSafariguides();
  }, []);

  return { safariguides, loading, error };
};

export default useSafariguide;