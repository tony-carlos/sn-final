// lib/hooks/useTours.js

import { useQuery } from '@tanstack/react-query';

/**
 * Fetches tour packages based on provided filters.
 *
 * @param {Object} filters - The filter criteria.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of tour packages.
 */
const fetchTours = async (filters) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        queryParams.append(key, value.join(','));
      } else {
        queryParams.append(key, value);
      }
    }
  });

  const response = await fetch(`/api/frontend/tour-packages?${queryParams.toString()}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch tours.');
  }

  const data = await response.json();
  return data.data;
};

/**
 * Custom hook to fetch tours based on filters.
 *
 * @param {Object} filters - The filter criteria.
 * @returns {Object} - The query result.
 */
export const useTours = (filters) => {
  return useQuery(['tours', filters], () => fetchTours(filters), {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
};
