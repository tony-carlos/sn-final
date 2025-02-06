// utils/getYouTubeVideoId.js

/**
 * Extracts the YouTube video ID from a given URL.
 *
 * @param {string} url - The full YouTube URL.
 * @returns {string|null} - The extracted video ID or null if not found.
 */
export const getYouTubeVideoId = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };
  