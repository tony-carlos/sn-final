// app/hooks/useAllQuotes.js

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

/**
 * Custom hook to fetch all quotes from Firestore.
 *
 * @returns {object} - Contains `quotes` (array), `loading` (boolean), and `error` (string) states.
 */
function useAllQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fetches all quotes from the Firestore `quotes` collection.
     */
    const fetchQuotes = async () => {
      setLoading(true);
      setError(null);

      try {
        const quotesCollection = collection(db, "quotes");
        const quotesSnapshot = await getDocs(quotesCollection);
        const quotesList = quotesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQuotes(quotesList);
      } catch (err) {
        console.error("Error fetching quotes:", err);
        setError("Failed to fetch quotes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, []);

  return { quotes, loading, error };
}

export default useAllQuotes;