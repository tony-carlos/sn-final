// /app/admin/hooks/useCustomizedRequests.js

"use client";

import { useState, useEffect } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from "firebase/firestore";

/**
 * Custom hook to manage customized requests from Firebase Firestore.
 *
 * @returns {object} - Contains all customized requests data, loading state, and function to delete requests.
 */
const useCustomizedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Create a query to order requests by dateVal descending
    const q = query(collection(db, "customizedrequest"), orderBy("dateVal", "desc"));

    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const requestsData = [];
        querySnapshot.forEach((doc) => {
          requestsData.push({ id: doc.id, ...doc.data() });
        });
        setRequests(requestsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching customized requests:", error);
        setLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Deletes a customized request by ID.
   *
   * @param {string} id - The ID of the request to delete.
   */
  const deleteRequest = async (id) => {
    try {
      await deleteDoc(doc(db, "customizedrequest", id));
    } catch (error) {
      console.error("Error deleting customized request:", error);
      throw error;
    }
  };

  return { requests, loading, deleteRequest };
};

export default useCustomizedRequests;
