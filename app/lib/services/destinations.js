// lib/services/destinations.js

import { db } from "@/app/lib/firebase"; // Ensure the path is correct
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";

/**
 * Fetches a single destination from Firestore based on slug.
 *
 * @param {string} slug - The slug of the destination.
 * @returns {Object|null} - Returns the destination object if found, otherwise null.
 */
export const fetchDestinationBySlug = async (slug) => {
  if (!slug) return null;

  try {
    const destinationsRef = collection(db, "destinations");
    const q = query(destinationsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const docData = doc.data();

    return {
      id: doc.id,
      title: docData.title,
      overview: docData.overview,
      climate: docData.climate,
      gettingThere: docData.gettingThere,
      images: docData.images,
      slug: docData.slug,
      type: docData.type,
      zone: docData.zone,
      whenToVisit: docData.whenToVisit,
      activities: docData.activities || [],
      commonAnimals: docData.commonAnimals || [],
      attractions: docData.attractions || [],
      featureCards: docData.featureCards || [],
      youtubeLink: docData.youtubeLink,
      seo: docData.seo,
      status: docData.status,
    };
  } catch (error) {
    console.error("Error fetching destination by slug:", error);
    throw error;
  }
};

/**
 * Fetches all destinations from Firestore.
 *
 * @returns {Array} - Returns an array of destination objects.
 */
export const fetchAllDestinations = async () => {
  try {
    const destinationsRef = collection(db, "destinations");
    const q = query(destinationsRef);
    const snapshot = await getDocs(q);

    const destinations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return destinations;
  } catch (error) {
    console.error("Error fetching all destinations:", error);
    throw error;
  }
};

/**
 * Fetches trending destinations from Firestore.
 *
 * @returns {Array} - Returns an array of trending destination objects.
 */
export const fetchTrendingDestinations = async () => {
  try {
    const destinationsRef = collection(db, "destinations");
    // Adjust the field name and query parameters as per your Firestore schema
    const q = query(
      destinationsRef,
      where("isTrending", "==", true),
      orderBy("trendingScore", "desc"), // Optional: Order by a trending score
      limit(10) // Limit to top 10 trending destinations
    );
    const snapshot = await getDocs(q);

    const trendingDestinations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return trendingDestinations;
  } catch (error) {
    console.error("Error fetching trending destinations:", error);
    throw error;
  }
};
