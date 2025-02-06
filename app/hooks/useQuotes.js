// app/hooks/useQuotes.js

import { useEffect, useState } from "react";

function useQuotes(quoteId) {
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quoteId) return;

    async function fetchQuote() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/quotes/${quoteId}`);
        if (!res.ok) {
          throw new Error(`Error fetching quote with id ${quoteId}`);
        }
        const data = await res.json();
        setQuote(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuote();
  }, [quoteId]);

  return { quote, loading, error };
}

export default useQuotes;
