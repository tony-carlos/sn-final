// /app/admin/safariguide/utils.js

import { db } from "@/app/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Generates a URL-friendly slug from a given string.
 * @param {string} text - The input text to convert.
 * @returns {string} - The generated slug.
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-"); // Replace multiple - with single -
};

/**
 * Ensures the slug is unique by appending a counter if necessary.
 * @param {string} baseSlug - The initial slug generated from the title.
 * @param {string|null} currentGuideId - The ID of the current guide being edited (if any).
 * @returns {Promise<string>} - A promise that resolves to a unique slug.
 */
export const ensureUniqueSlug = async (baseSlug, currentGuideId = null) => {
  let uniqueSlug = baseSlug;
  let counter = 1;

  const guidesRef = collection(db, "safariguide");
  let slugExists = true;

  while (slugExists) {
    const q = query(guidesRef, where("slug", "==", uniqueSlug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // Slug is unique
      slugExists = false;
    } else {
      if (currentGuideId) {
        // If editing, check if the existing slug belongs to the current guide
        const isCurrentGuide = Array.from(querySnapshot.docs).some(
          (doc) => doc.id === currentGuideId
        );
        if (isCurrentGuide) {
          slugExists = false;
        } else {
          // Slug exists for another guide
          uniqueSlug = `${baseSlug}-${counter}`;
          counter += 1;
        }
      } else {
        // Slug exists for another guide
        uniqueSlug = `${baseSlug}-${counter}`;
        counter += 1;
      }
    }
  }

  return uniqueSlug;
};
