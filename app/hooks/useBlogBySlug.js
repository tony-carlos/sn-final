// app/hooks/useBlogBySlug.js

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

/**
 * Custom hook to fetch a single blog by slug from Firestore.
 *
 * @param {string} slug - The slug of the blog to fetch.
 * @returns {Object} - { blog, loading, error }
 */
const useBlogBySlug = (slug) => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setError(new Error("No slug provided."));
      setLoading(false);
      return;
    }

    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, where("slug", "==", slug));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setBlog({ id: doc.id, ...doc.data() });
        } else {
          setError(new Error("Blog not found."));
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching blog by slug:", err);
        setError(err);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount or slug change
    return () => unsubscribe();
  }, [slug]);

  return { blog, loading, error };
};

export default useBlogBySlug;
