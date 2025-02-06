// app/hooks/useBlogs.js

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

/**
 * Custom hook to fetch all blogs from Firestore.
 *
 * @returns {Object} - { blogs, loading, error }
 */
const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const blogsData = [];
        snapshot.forEach((doc) => {
          blogsData.push({ id: doc.id, ...doc.data() });
        });
        setBlogs(blogsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching blogs:", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return { blogs, loading, error };
};

export default useBlogs;
