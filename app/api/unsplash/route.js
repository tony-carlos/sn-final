// /pages/api/unsplash.js
export const runtime = "edge"; // <-- Add this at the top

import axios from 'axios';

export default async function handler(req, res) {
  const { query, per_page } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: per_page || 12,
      },
      headers: {
        Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`, // Ensure you have this in your environment variables
      },
    });

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Unsplash API Error:', error.response ? error.response.data : error.message);
    return res.status(500).json({ error: 'Failed to fetch images from Unsplash.' });
  }
}
