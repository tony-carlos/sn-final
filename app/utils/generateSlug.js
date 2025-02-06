// app/utils/generateSlug.js

/**
 * Generates a URL-friendly slug from a given string.
 * @param {string} text - The input string to generate slug from.
 * @returns {string} - The generated slug.
 */
const generateSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
  };
  
  export default generateSlug;
  