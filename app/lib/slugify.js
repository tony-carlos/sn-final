// app/lib/helpers.js

/**
 * Converts a string into a URL-friendly slug.
 * @param {string} text - The text to slugify.
 * @returns {string} - The slugified string.
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-");
};
