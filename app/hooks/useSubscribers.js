// app/hooks/useSubscribers.js

import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

/**
 * Custom Hook: useSubscribers
 *
 * Fetches all subscribers from Firestore, ordered by createdAt in descending order.
 *
 * @returns {Object} - Contains subscribers array and loading state.
 */
const useSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reference to the 'subscribers' collection
    const subscribersRef = collection(db, "subscribers");

    // Query: Order by 'createdAt' descending
    const q = query(subscribersRef, orderBy("createdAt", "desc"));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const subscribersData = [];
        querySnapshot.forEach((doc) => {
          subscribersData.push({ id: doc.id, ...doc.data() });
        });
        setSubscribers(subscribersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching subscribers:", error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { subscribers, loading };
};

export default useSubscribers;
