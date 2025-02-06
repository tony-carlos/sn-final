// /app/admin/tour-packages/create/utils/generateSlug.js

/**
 * Generates a URL-friendly slug from a given string.
 *
 * @param {string} title - The string to generate a slug from.
 * @returns {string} - The generated slug.
 */
const generateSlug = (title) => {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove non-word characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-'); // Replace multiple hyphens with a single hyphen
};

export default generateSlug;
