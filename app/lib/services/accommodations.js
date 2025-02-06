// lib/services/accommodations.js

import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Fetch all accommodations.
 * @returns {Promise<Array>} List of accommodations.
 */
export const fetchAllAccommodations = async () => {
  try {
    const accommodationsRef = collection(db, "accommodations");
    const snapshot = await getDocs(accommodationsRef);
    const accommodations = snapshot.docs.map((doc) => ({
      id: doc.id,
      destinationSlug: doc.data().destinationSlug,
      accommodationTitle: doc.data().accommodationTitle,
      slug: doc.data().slug,
      description: doc.data().description,
      images: doc.data().images,
      seo: doc.data().seo,
      pricePerNight: doc.data().pricePerNight,
    }));
    return accommodations;
  } catch (error) {
    console.error("Error fetching accommodations:", error);
    throw error;
  }
};

/**
 * Fetch accommodations by destination slug.
 * @param {string} destinationSlug - Destination slug.
 * @returns {Promise<Array>} List of accommodations.
 */
export const fetchAccommodationsByDestinationSlug = async (destinationSlug) => {
  try {
    const accommodationsRef = collection(db, "accommodations");
    const q = query(
      accommodationsRef,
      where("destinationSlug", "==", destinationSlug)
    );
    const snapshot = await getDocs(q);
    const accommodations = snapshot.docs.map((doc) => ({
      id: doc.id,
      destinationSlug: doc.data().destinationSlug,
      accommodationTitle: doc.data().accommodationTitle,
      slug: doc.data().slug,
      description: doc.data().description,
      images: doc.data().images,
      seo: doc.data().seo,
      pricePerNight: doc.data().pricePerNight,
    }));
    return accommodations;
  } catch (error) {
    console.error(
      `Error fetching accommodations for slug ${destinationSlug}:`,
      error
    );
    throw error;
  }
};

/**
 * Fetch a single accommodation by its slug.
 * @param {string} slug - Accommodation slug.
 * @returns {Promise<Object|null>} The accommodation object or null if not found.
 */
export const fetchAccommodationBySlug = async (slug) => {
  try {
    const accommodationsRef = collection(db, "accommodations");
    const q = query(accommodationsRef, where("slug", "==", slug), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn(`No accommodation found with slug: ${slug}`);
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      destinationSlug: data.destinationSlug,
      accommodationTitle: data.accommodationTitle,
      slug: data.slug,
      description: data.description,
      images: data.images,
      seo: data.seo,
      pricePerNight: data.pricePerNight,
    };
  } catch (error) {
    console.error(`Error fetching accommodation with slug ${slug}:`, error);
    throw error;
  }
};
