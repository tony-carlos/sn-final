// utils/fetchTourPackages.js

import axios from 'axios';

/**
 * Fetches tour packages from the backend API.
 * @param {Object} params - The query parameters.
 * @returns {Promise<Array>} - A promise that resolves to an array of tour packages.
 */
const fetchTourPackages = async (params) => {
  try {
    const response = await axios.get('/api/frontend/tour-packages', {
      params: {
        ...params,
        tags: params.tags ? params.tags.join(',') : undefined,
        mainFocusSlugs: params.mainFocusSlugs ? params.mainFocusSlugs.join(',') : undefined,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    throw error;
  }
};

export default fetchTourPackages;
