// utils.js

/**
 * Constructs image URLs from Firestore image objects.
 * Handles both 'url' and 'storagePath' fields.
 *
 * @param {Object} image - Image object containing either 'url' or 'storagePath'.
 * @param {string} bucket - Firebase Storage bucket name.
 * @returns {string|null} - Constructed image URL or null if invalid.
 */
export const constructImageURL = (image, bucket) => {
    if (!image) return null;
    if (image.url) {
      return image.url; // Use the URL directly without additional encoding
    } else if (image.storagePath) {
      // Encode the storagePath only once
      return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(
        image.storagePath
      )}?alt=media`;
    }
    return null;
  };
  